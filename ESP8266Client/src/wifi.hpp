#pragma once

#include <Arduino.h>

namespace wifi
{
    bool connect(const String &ssid, const String &password, int timeout = -1);
} // namespace wifi
