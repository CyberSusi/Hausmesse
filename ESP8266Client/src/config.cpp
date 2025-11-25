#include "config.hpp"
#include <Arduino.h>
#include <ArduinoJson.h>
#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <LittleFS.h>

namespace config
{
    void handleRoot();
    void handleSave();

    Config config;
    ESP8266WebServer server(80);

    Config *get()
    {
        return &config;
    }

    bool init()
    {
        Serial.println("Initializing FS");
        if (!LittleFS.begin())
        {
            Serial.println("Failed to mount file system");
            return false;
        }

        Serial.println("Opening config from FS");
        File file = LittleFS.open("/config.json", "r");
        if (!file)
        {
            Serial.println("Failed to open config file");
            return false;
        }

        ArduinoJson::JsonDocument doc;
        DeserializationError error = deserializeJson(doc, file);
        file.close();

        if (error)
        {
            Serial.println("Failed to parse config file");
            return false;
        }

        config.ssid = doc["wifi_ssid"].as<String>();
        config.pass = doc["wifi_pass"].as<String>();
        config.host = doc["host"].as<String>();
        config.auth = doc["auth"].as<String>();
        return true;
    }

    bool isValid()
    {
        return config.ssid.length() > 0 &&
               config.pass.length() > 0 &&
               config.host.length() > 0 &&
               config.auth.length() > 0;
    }

    bool isInConfigMode()
    {
        return WiFi.getMode() == WIFI_AP;
    }

    void startClient()
    {
        WiFi.mode(WIFI_AP);
        WiFi.softAP("ESP_Config");

        IPAddress IP = WiFi.softAPIP();
        Serial.print("Config portal running. Connect to WiFi: ESP_Config, then go to http://");
        Serial.println(IP);

        server.on("/", HTTP_GET, handleRoot);
        server.on("/save", HTTP_POST, handleSave);
        server.begin();
    }

    void handleClient()
    {
        server.handleClient();
    }

    void handleRoot()
    {
        String html = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <title>ESP Config</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f2f2f2;
      padding: 20px;
    }
    h2 {
      color: #333;
    }
    form {
      display: flex;
      flex-direction: column;
      background: #fff;
      padding: 20px;
      border-radius: 10px;
      max-width: 400px;
      margin: auto;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    input[type="text"] {
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 16px;
    }
    input[type="submit"] {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      background-color: #4CAF50;
      border: none;
      color: white;
      font-size: 16px;
      border-radius: 5px;
      cursor: pointer;
    }
    input[type="submit"]:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <form action="/save" method="POST">
    <h2>ESP Configuration</h2>
    SSID: <input type="text" name="ssid" value=")rawliteral" +
                      config.ssid + R"rawliteral(">
    Password: <input type="text" name="pass" value=")rawliteral" +
                      config.pass + R"rawliteral(">
    Host: <input type="text" name="host" value=")rawliteral" +
                      config.host + R"rawliteral(">
    Auth: <input type="text" name="auth" value=")rawliteral" +
                      config.auth + R"rawliteral(">
    <input type="submit" value="Save">
  </form>
</body>
</html>
)rawliteral";

        server.send(200, "text/html", html);
    }

    void handleSave()
    {
        String ssid = server.arg("ssid");
        String pass = server.arg("pass");
        String host = server.arg("host");
        String auth = server.arg("auth");

        ArduinoJson::JsonDocument doc;
        doc["wifi_ssid"] = ssid;
        doc["wifi_pass"] = pass;
        doc["host"] = host;
        doc["auth"] = auth;

        File file = LittleFS.open("/config.json", "w");
        if (!file)
        {
            server.send(500, "text/plain", "Failed to open file for writing.");
            return;
        }

        serializeJson(doc, file);
        file.close();

        server.send(200, "text/html", "Configuration saved. Restarting...");
        delay(2000);
        ESP.restart();
    }
}