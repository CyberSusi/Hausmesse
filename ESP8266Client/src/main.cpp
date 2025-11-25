#include "http.hpp"
#include "wifi.hpp"
#include "config.hpp"
#include "sensors/hcsr04.hpp"

#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>

#define LEDPIN 2
#define ONE_MINUTE 60000

void ledOn() { digitalWrite(LEDPIN, LOW); }
void ledOff() { digitalWrite(LEDPIN, HIGH); }

void setup()
{
    Serial.begin(115200);
    pinMode(LEDPIN, OUTPUT);

    String mac = WiFi.macAddress();
    Serial.printf("\nHardwareId: %s\n", mac.c_str());

    if (!config::init() || !config::isValid())
    {
        Serial.println("No valid config. Starting config portal...");
        config::startClient();
        return;
    }

    config::Config *cfg = config::get();
    if (!wifi::connect(cfg->ssid, cfg->pass, ONE_MINUTE))
    {
        Serial.println("Unable to establish wifi connection. Starting config portal...");
        config::startClient();
        return;
    }

    http::init(cfg->host, cfg->auth);
    int response = http::check("/api/measurements/check?hardwareId=" + mac);
    if (response < 200 || response > 204)
    {
        Serial.println("Api authorization failed. Starting config portal...");
        config::startClient();
        return;
    }

    sensors::hcsr04::init();
}

void loop()
{
    if (config::isInConfigMode())
    {
        config::handleClient();
        return;
    }

    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("WiFi disconnected, trying to reconnect...");
        config::Config *cfg = config::get();
        wifi::connect(cfg->ssid, cfg->pass);
    }

    ledOn();

    float distance = sensors::hcsr04::getDistance();

    ArduinoJson::JsonDocument doc;
    String macAddress = WiFi.macAddress();
    String buffer;

    doc["HardwareId"] = macAddress;
    doc["Distance"] = distance;

    ArduinoJson::serializeJson(doc, buffer);

    int response = http::post("/api/measurements", buffer);
    if (response < 200 || response >= 300)
    {
        Serial.printf("Api request unsucessful with status %d\n", response);
        if (response == 401)
        {
            Serial.println("Api authorization failed. Starting config portal...");
            ledOff();
            config::startClient();
            return;
        }
    }

    ledOff();
    delay(10000);
}
