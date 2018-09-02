/**
 * @license 
 * abbozza!
 * 
 * File: abbozza.cpp
 * 
 * A parser for the serial connection
 * 
 * Copyright 2017 Michael Brinkmeier
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */


#include "Arduino.h"
#include "abbozza.h"

void writeByteToUSB(int value) {
    Serial.write(value & 256);
}


void writeIntToUSB(int value) {
    long val = (long) value;
    byte buf[4];
    buf[0] = ( val >> 24 ) % 256;
    buf[1] = ( val >> 16 ) % 256;
    buf[2] = ( val >> 8 ) % 256;
    buf[3] = val % 256;
    Serial.write(buf,4);
}


int readByteFromUSB() {
    int val = Serial.read();
}


int readIntFromUSB() {
    int val;
    long read;
    byte buf[4];
    if ( Serial.available() > 3 ) {
        Serial.readBytes(buf,4);
        read = ( buf[0] << 24 ) | (buf[1] << 16 ) | ( buf[2] << 8 ) | buf[3];
        return (int) read;
    } else {
        return 0;
    }
}