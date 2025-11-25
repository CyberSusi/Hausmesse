#include <ESP8266WiFi.h>

#define DELAY 500

namespace wifi
{
    bool isTimedOut(int elapsed, int timeout)
    {
        return timeout > 0 && elapsed >= timeout;
    }

    bool connect(const String &ssid, const String &password, int timeout = -1)
    {
        WiFi.mode(WIFI_STA);
        WiFi.disconnect();
        delay(100);

        Serial.printf("\nConnecting to %s", ssid.c_str());

        WiFi.begin(ssid, password);

        int elapsed = 0;
        while (WiFi.status() != WL_CONNECTED && !isTimedOut(elapsed, timeout))
        {
            delay(DELAY);
            elapsed += DELAY;
            Serial.print(".");
        }

        if (WiFi.status() == WL_CONNECTED)
        {
            Serial.printf("\nConnected to WiFi network with IP address: %s\n",
                          WiFi.localIP().toString().c_str());
            return true;
        }
        else
        {
            Serial.println("\nFailed to connect to WiFi.");
            return false;
        }
    }
} // namespace wifi
