#pragma once

#include <Arduino.h>

namespace config
{
    struct Config
    {
        String ssid;
        String pass;
        String host;
        String auth;
    };

    Config *get();
    bool init();
    bool isValid();
    bool isInConfigMode();
    void startClient();
    void handleClient();
}