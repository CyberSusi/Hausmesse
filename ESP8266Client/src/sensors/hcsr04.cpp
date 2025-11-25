#include "hcsr04.hpp"
#include <Arduino.h>

#define TRIGPIN 12
#define ECHOPIN 14
#define SOUND_VELOCITY 0.034

namespace sensors::hcsr04
{
    void init()
    {
        pinMode(TRIGPIN, OUTPUT);
        pinMode(ECHOPIN, INPUT);
    }

    float getDistance()
    {
        float duration, distanceCm;

        digitalWrite(TRIGPIN, LOW);
        delayMicroseconds(2);

        // TRIGPIN triggers measurement
        digitalWrite(TRIGPIN, HIGH);
        delayMicroseconds(10);
        digitalWrite(TRIGPIN, LOW);

        // ECHOPIN returns the sound wave travel time in microseconds
        duration = pulseIn(ECHOPIN, HIGH);
        distanceCm = duration * SOUND_VELOCITY / 2;

        Serial.printf("\nDuration: %f", duration);
        Serial.printf("\nDistance: %f\n", distanceCm);
        return distanceCm;
    }
}