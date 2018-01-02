/**
 * @license
 * abbozza!
 *
 * Copyright 2015 Michael Brinkmeier ( michael.brinkmeier@uni-osnabrueck.de )
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
/**
 * @fileoverview Blocks for teachers
 * 
 * @author michael.brinkmeier@uni-osnabrueck.de (Michael Brinkmeier)
 */

DEV_TYPE_NEOPIXEL_STRIP = "neopixel";


Abbozza.NeoPixelSetPixelRGB = {
  init: function() {
    this.setHelpUrl(Abbozza.HELP_URL);
    this.setColour(ColorMgr.getCatColor("cat.LEDs"));
    this.appendValueInput("NUMBER")
        .appendField("Setze Farbe von LED")
        .setCheck("NUMBER");
    this.appendValueInput("RED")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Rot")
        .setCheck("NUMBER");
    this.appendValueInput("GREEN")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Grün")
        .setCheck("NUMBER");
    this.appendValueInput("BLUE")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Blau")
        .setCheck("NUMBER");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "STATEMENT");
    this.setNextStatement(true, "STATEMENT");
    this.setTooltip('');
  },
  
  generateCode : function(generator) {
        var name = "strip->strip";

        var number = generator.valueToCode(this,"NUMBER");
        
  	var red = generator.valueToCode(this,"RED");
  	var green = generator.valueToCode(this,"GREEN");
  	var blue = generator.valueToCode(this,"BLUE");

  	return name + "->setPixelColor("
            + number + "," + red + "," + green + "," + blue + ");";
  }
  
};



Abbozza.NeoPixelSetPixelColor = {
  init: function() {
    this.setHelpUrl(Abbozza.HELP_URL);
    this.setColour(ColorMgr.getCatColor("cat.LEDs"));
    this.appendValueInput("NUMBER")
        .appendField("Setze LED")
        .setCheck("NUMBER");
    this.appendDummyInput()
        .appendField("auf Farbe")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldColour("#000000"), "COLOR");        
    this.setInputsInline(true);
    this.setPreviousStatement(true, "STATEMENT");
    this.setNextStatement(true, "STATEMENT");
    this.setTooltip('');
  },
  
  generateCode : function(generator) {
        var name = "strip->strip";

        var number = generator.valueToCode(this,"NUMBER");                
        var color = generator.fieldToCode(this,"COLOR");
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        var red = parseInt(result[1],16);
        var green = parseInt(result[2],16);
        var blue = parseInt(result[3],16);

        return name + "->setPixelColor("
            + number + "," + red + "," + green + "," + blue + ");";
  }
  
};


Abbozza.NeoPixelStep = {
  init: function() {
    this.setHelpUrl(Abbozza.HELP_URL);
    this.setColour(ColorMgr.getCatColor("cat.LEDs"));
    this.appendDummyInput()
        .appendField("Nummer des Frames");
    this.setInputsInline(false);    
    this.setOutput(true,["NUMBER"]);
    this.setTooltip('');
  },
  
  generateCode : function(generator) {
        return "frame";
  }
  
};

Abbozza.NeoPixelRainbowRed = {
  init: function() {
    this.setHelpUrl(Abbozza.HELP_URL);
    this.setColour(ColorMgr.getCatColor("cat.LEDs"));
    this.appendDummyInput()
        .appendField("Regenbogen Rot");
    this.appendValueInput("STEPS")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Schrittzahl:")
        .setCheck("NUMBER");
    this.appendValueInput("STEP")
        .appendField("Schritt:")
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck("NUMBER");
    this.setInputsInline(false);    
    this.setOutput(true,["NUMBER"]);
    this.setTooltip('');
  },
  
  generateCode : function(generator) {
    var steps = generator.valueToCode(this,"STEPS");
    var step = generator.valueToCode(this,"STEP");
    return "strip->mantel->rainbowRed(" + step + ",(" + steps + ")/6)";
  }
  
};

Abbozza.NeoPixelRainbowGreen = {
  init: function() {
    this.setHelpUrl(Abbozza.HELP_URL);
    this.setColour(ColorMgr.getCatColor("cat.LEDs"));
    this.appendDummyInput()
        .appendField("Regenbogen Grün");
    this.appendValueInput("STEPS")
        .appendField("Schrittzahl:")
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck("NUMBER");
    this.appendValueInput("STEP")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Schritt:")
        .setCheck("NUMBER");
    this.setInputsInline(false);    
    this.setOutput(true,["NUMBER"]);
    this.setTooltip('');
  },
  
  generateCode : function(generator) {
    var steps = generator.valueToCode(this,"STEPS");
    var step = generator.valueToCode(this,"STEP");
    return "strip->mantel->rainbowGreen(" + step + ",(" + steps + ")/6)";
  }
  
};

Abbozza.NeoPixelRainbowBlue = {
  init: function() {
    this.setHelpUrl(Abbozza.HELP_URL);
    this.setColour(ColorMgr.getCatColor("cat.LEDs"));
    this.appendDummyInput()
        .appendField("Regenbogen Blau");
    this.appendValueInput("STEPS")
        .appendField("Schrittzahl:")
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck("NUMBER");
    this.appendValueInput("STEP")
        .appendField("Schritt:")
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck("NUMBER");
    this.setInputsInline(false);    
    this.setOutput(true,["NUMBER"]);
    this.setTooltip('');
  },
  
  generateCode : function(generator) {
    var steps = generator.valueToCode(this,"STEPS");
    var step = generator.valueToCode(this,"STEP");
    return "strip->mantel->rainbowBlue(" + step + ", (" + steps + ")/6)";
  }
  
};

Blockly.Blocks['dev_neopixel_rgb'] = Abbozza.NeoPixelSetPixelRGB;
Blockly.Blocks['dev_neopixel_color'] = Abbozza.NeoPixelSetPixelColor;
Blockly.Blocks['dev_neopixel_step'] = Abbozza.NeoPixelStep;
Blockly.Blocks['dev_neopixel_rred'] = Abbozza.NeoPixelRainbowRed;
Blockly.Blocks['dev_neopixel_rgreen'] = Abbozza.NeoPixelRainbowGreen;
Blockly.Blocks['dev_neopixel_rblue'] = Abbozza.NeoPixelRainbowBlue;
