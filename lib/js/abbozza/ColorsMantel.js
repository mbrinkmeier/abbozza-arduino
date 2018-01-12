/**
 * @license 
 * abbozza!
 * 
 * File: AbbozzaMantel.js
 * 
 * Additions and modifications for the core object of the abbozza! client 
 * for the Science Truck Coat.
 * 
 * Copyright 2015 Michael Brinkmeier
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

/**
 * Set the colors.
 * 
 * @returns {undefined}
 */
ColorMgr.resetColors = function () {
    
    ColorMgr.catColor["cat.CTRL"] = "#FF8000";  // 330
    ColorMgr.catColor["cat.COND"] = "#FFA000";  // 0
    ColorMgr.catColor["cat.LOOPS"] = "#FF8000"; // 345
    ColorMgr.catColor["cat.VAR"] = "#FF6000";   // 300
    ColorMgr.catColor["cat.FUNC"] = "#FF4000";  // 330
    ColorMgr.catColor["cat.FARBEN"] = "#A0A0A0";  // 330
    ColorMgr.catColor["cat.TEMPLATES"] = "#2020FF";  // 330
    
    ColorMgr.catColor["cat.LOGIC"] = "#FF0000"; // 330
    ColorMgr.catColor["cat.MATH"] = "#800080";  // 270
    ColorMgr.catColor["cat.TEXT"] = "#0040FF";  // 240
    ColorMgr.catColor["cat.DISPLAY"] = "#0080FF";  // 240
    
    ColorMgr.catColor["cat.INOUT"] = "#0080C0"; // 160
    ColorMgr.catColor["cat.DEVICES"] = "#008090"; // 135
    ColorMgr.catColor["cat.DEVIN"] = "#008060";   // 115
    ColorMgr.catColor["cat.DEVOUT"] = "#008030";   // 90
    ColorMgr.catColor["cat.SOUND"] = "#008000"; // 90
    ColorMgr.catColor["cat.MOTOR"] = "#008010"; // 90

    ColorMgr.catColor["cat.USB"]    = "#808000"; // 30
    ColorMgr.catColor["cat.SERIAL"] = "#A08000"; // 60
    ColorMgr.catColor["cat.RADIO"] = "#A08000"; // 60
    ColorMgr.catColor["cat.I2C"] = "#C08000"; // 60
    ColorMgr.catColor["cat.I2C_MASTER"] = "#C08000"; // 60
    ColorMgr.catColor["cat.I2C_SLAVE"] = "#C08000"; // 60
    ColorMgr.catColor["cat.INT"]    = "#E08000"; // 45
    ColorMgr.catColor["cat.EVENTS"]    = "#E08000"; // 45

    ColorMgr.typeColor = new Array();

    ColorMgr.typeColor["BOOLEAN"] = "#FF0000"; // 285;
    ColorMgr.typeColor["NUMBER"] = "#800080"; // 250;
    ColorMgr.typeColor["DECIMAL"] = "#6000A0"; // 215;
    ColorMgr.typeColor["STRING"] = "#0000FF"; // 180;
    ColorMgr.typeColor["DEVICE"] = "#008010"; // 145;
    ColorMgr.typeColor["VAR"] = "#FF6000"; // 110;
    ColorMgr.typeColor["FUNC"] = "#FF4000"; // 75;
    ColorMgr.typeColor["PIN"] = "#00800"; // 40;
    ColorMgr.typeColor["ARR_DIM"] = "#FF6000"; // 5;
    ColorMgr.typeColor[""] = "#FF8000"; // 330;
}

