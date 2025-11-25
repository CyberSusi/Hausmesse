#pragma once

#include <Arduino.h>

namespace http
{
    void init(const String &host, const String &token);
    int check(const String &endpoint);
    int post(const String &endpoint, const String &json);
} // namespace http
