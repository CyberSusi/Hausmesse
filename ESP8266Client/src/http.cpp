#include "http.hpp"

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>

namespace http
{
    struct HttpConfig
    {
        String host;
        String token;
    };

    HttpConfig config;

    void setupClient(HTTPClient &http, WiFiClientSecure &client, const String &endpoint);

    void init(const String &host, const String &token)
    {
        config.host = host;
        config.token = "Bearer " + token;
    }

    int check(const String &endpoint)
    {
        WiFiClientSecure client;
        HTTPClient http;
        setupClient(http, client, endpoint);
        int httpResponseCode = http.GET();

        http.end();
        Serial.printf("HTTP Response: %d\n", httpResponseCode);

        return httpResponseCode;
    }

    int post(const String &endpoint, const String &json)
    {
        WiFiClientSecure client;
        HTTPClient http;
        setupClient(http, client, endpoint);

        http.addHeader("Content-Type", "application/json");
        Serial.printf("JSON: %s\n", json.c_str());

        int httpResponseCode = http.POST(json.c_str());
        String payload = http.getString();

        http.end();
        Serial.printf("HTTP Response: %d\n", httpResponseCode);
        Serial.println(payload);

        return httpResponseCode;
    }

    void setupClient(HTTPClient &http, WiFiClientSecure &client, const String &endpoint)
    {
        String url = config.host + endpoint;
        client.setInsecure();
        http.begin(client, url);
        http.addHeader("Authorization", config.token);
        Serial.printf("Starting request to: %s\n", url.c_str());
    }
} // namespace http
