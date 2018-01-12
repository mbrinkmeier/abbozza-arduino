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


Abbozza.ColorNumber = 0;
Abbozza.ColorLength = 0;

Abbozza.MantelSequenz = {
    title: "<title>",
    symbols: null,
    // test: "",

    init: function () {
        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getCatColor("cat.LOGIC"));
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.appendStatementInput("COLORS")
                .appendField("Lasse die Farbfolge laufen")
                .setCheck("COLOR");
        this.appendDummyInput()
            .appendField("Zeit zwischen den Schritten")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldNumber(),"SPEED");
        this.appendDummyInput()
            .appendField("Wiederholen")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldCheckbox(1),"REPEAT");
        this.appendDummyInput()
            .appendField("Rückwärts")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldCheckbox(0),"REVERSE");
        this.setTooltip('');
        this.setDeletable(false);
    },

    setSymbolDB: function (db) {
        this.symbols = db;
    },
    setTitle: function (title) {
    },
    compose: function (topBlock) {
    },
    decompose: function (workspace) {
    },
    generateSetupCode: function (generator) {
        return "";
    },
    generateCode: function (generator) {
        var code = "";
        var delay = generator.fieldToCode(this,"SPEED");
        var repeat = generator.fieldToCode(this,"REPEAT").toLowerCase();
        var reverse = generator.fieldToCode(this,"REVERSE").toLowerCase();
        
        if ( delay <= 0 ) delay = 1;
        
        generator.addSetupCode("strip->frameDelay = " + delay + ";\n");
        generator.addSetupCode("strip->frameNumber = 127;\n");
        
        Abbozza.ColorNumber = 0;
        
        var colors = generator.statementToCode(this, 'COLORS', "");
        console.log(colors);
        
        generator.addSetupCode(colors+"\n");

        Abbozza.ColorLength = Abbozza.ColorNumber;
        
        code = "   strip->showColors(frame," + Abbozza.ColorLength + "," + repeat + "," + reverse + ");";
        
        return code;
    },
    check: function (block) {
        return "Test";
    }
};


Blockly.Blocks['main_seq'] = Abbozza.MantelSequenz;



Abbozza.MantelFarbe = {
    init: function () {
        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getColor("cat.FARBEN"));
        this.appendDummyInput()
           .appendField(new Blockly.FieldColour("#000000"), "COLOR");        
        this.setInputsInline(false);
        this.setPreviousStatement(true, "COLOR");
        this.setNextStatement(true, "COLOR");
        this.setTooltip('');
    },
    setName: function (name) {
        this.name = name;
    },
    generateCode: function (generator) {
        var color = generator.fieldToCode(this,"COLOR");
        
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        var red = parseInt(result[1],16);
        var green = parseInt(result[2],16);
        var blue = parseInt(result[3],16);
        var col = (  red * 256  + green ) * 256 + blue;
                
        var nr = Abbozza.ColorNumber;
        if ( nr >= 30 ) nr = 29;
        var code = "strip->colors[" + nr + "]=" + col + ";";
        Abbozza.ColorNumber++;
        
        return code;
    }
};

Blockly.Blocks['mantel_farbe'] = Abbozza.MantelFarbe;




Abbozza.MantelTemplate = {
    title: "<title>",
    symbols: null,
    // test: "",

    init: function () {
        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getCatColor("cat.LOGIC"));
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.appendDummyInput()
                .appendField("Lasse Vorlagen gemeinsam laufen");
        this.appendStatementInput("TEMPLATES")
                .setCheck("TEMPLATE");
        this.appendDummyInput()
            .appendField("Zeit zwischen den Schritten")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldNumber(),"SPEED");
        this.setTooltip('');
        this.setDeletable(false);
    },

    setSymbolDB: function (db) {
        this.symbols = db;
    },
    setTitle: function (title) {
    },
    compose: function (topBlock) {
    },
    decompose: function (workspace) {
    },
    generateSetupCode: function (generator) {
        return "";
    },
    generateCode: function (generator) {
        var code = "";
        var delay = generator.fieldToCode(this,"SPEED");
        
        if ( delay <= 0 ) delay = 1;
        
        generator.addSetupCode("strip->frameDelay = " + delay + ";\n");
        generator.addSetupCode("strip->frameNumber = 127;\n");
        
        var templates = generator.statementToCode(this, 'TEMPLATES', "    ");
        
        code +=  "  strip->clearStrip();\n";
        code +=  "  long color = 0;\n";
        code +=  "  for (int pos = 0; pos < LEN; pos++) {\n";
        code +=  "    color = 0;\n";
        code +=  templates + "\n";
        code +=  "    strip->setColor(pos,color);\n";
        code +=  "  }\n";
        
        return code;
    },
    check: function (block) {
        return "Test";
    }
};


Blockly.Blocks['main_temp'] = Abbozza.MantelTemplate;



Abbozza.MantelPixel = {
    init: function () {
        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getColor("cat.TEMPLATES"));
        this.appendDummyInput()
           .appendField("Lasse Pixel vorwärts laufen");
        this.appendDummyInput()
           .setAlign(Blockly.ALIGN_RIGHT)   
           .appendField("Farbe")
           .appendField(new Blockly.FieldColour("#000000"), "COLOR");
        this.appendDummyInput()
           .setAlign(Blockly.ALIGN_RIGHT)   
           .appendField("Startposition")
           .appendField(new Blockly.FieldNumber(0), "START");
        this.setInputsInline(false);
        this.setPreviousStatement(true, "TEMPLATE");
        this.setNextStatement(true, "TEMPLATE");
        this.setTooltip('');
    },
    setName: function (name) {
        this.name = name;
    },
    generateCode: function (generator) {
        var color = generator.fieldToCode(this,"COLOR");
        var start = generator.fieldToCode(this,"START");
        
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        var red = parseInt(result[1],16);
        var green = parseInt(result[2],16);
        var blue = parseInt(result[3],16);
        var col = (  red * 256  + green ) * 256 + blue;

        var code = "color = strip->mixColors(color,strip->runningPixel(pos,frame," + start + "," + col + ", false));";
        
        return code;
    }
};

Blockly.Blocks['mantel_pixel'] = Abbozza.MantelPixel;


Abbozza.MantelPixelRev = {
    init: function () {
        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getColor("cat.TEMPLATES"));
        this.appendDummyInput()
           .appendField("Lasse Pixel rückwärts laufen");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)   
           .appendField("Farbe")
           .appendField(new Blockly.FieldColour("#000000"), "COLOR");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)   
           .appendField("Startposition")
           .appendField(new Blockly.FieldNumber(0), "START");
        this.setInputsInline(false);
        this.setPreviousStatement(true, "TEMPLATE");
        this.setNextStatement(true, "TEMPLATE");
        this.setTooltip('');
    },
    setName: function (name) {
        this.name = name;
    },
    generateCode: function (generator) {
        var color = generator.fieldToCode(this,"COLOR");
        var start = generator.fieldToCode(this,"START");
        
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        var red = parseInt(result[1],16);
        var green = parseInt(result[2],16);
        var blue = parseInt(result[3],16);
        var col = (  red * 256  + green ) * 256 + blue;

        var code = "color = strip->mixColors(color,strip->runningPixel(pos,frame," + start + "," + col + ", true));";
        
        return code;
    }
};

Blockly.Blocks['mantel_pixel_rev'] = Abbozza.MantelPixelRev;



Abbozza.MantelPixelBackground = {
    init: function () {
        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getColor("cat.TEMPLATES"));
        this.appendDummyInput()
           .appendField("Alle Pixel");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)   
           .appendField("Farbe")
           .appendField(new Blockly.FieldColour("#000000"), "COLOR");
        this.setInputsInline(false);
        this.setPreviousStatement(true, "TEMPLATE");
        this.setNextStatement(true, "TEMPLATE");
        this.setTooltip('');
    },
    setName: function (name) {
        this.name = name;
    },
    generateCode: function (generator) {
        var color = generator.fieldToCode(this,"COLOR");
        
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        var red = parseInt(result[1],16);
        var green = parseInt(result[2],16);
        var blue = parseInt(result[3],16);
        var col = (  red * 256  + green ) * 256 + blue;

        var code = "color = strip->mixColors(color," + col + ");";
        
        return code;
    }
};

Blockly.Blocks['mantel_pixel_bkg'] = Abbozza.MantelPixelBackground;


Abbozza.MantelPixelSequenz = {
    init: function () {
        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getColor("cat.TEMPLATES"));
        this.appendStatementInput("COLORS")
            .appendField("Lasse die Farbfolge laufen")
            .setCheck("COLOR");
        this.appendDummyInput()
           .setAlign(Blockly.ALIGN_RIGHT)   
           .appendField("Startposition")
           .appendField(new Blockly.FieldNumber(0), "START");
        this.appendDummyInput()
            .appendField("Rückwärts")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldCheckbox(0),"REVERSE");
        this.setInputsInline(false);
        this.setPreviousStatement(true, "TEMPLATE");
        this.setNextStatement(true, "TEMPLATE");
        this.setTooltip('');
    },
    setName: function (name) {
        this.name = name;
    },
    generateCode: function (generator) {
        Abbozza.ColorNumber = 0;
        var colors = generator.statementToCode(this, 'COLORS', "  ");
        var reverse = generator.fieldToCode(this,"REVERSE").toLowerCase();
        
        console.log(colors);
        
        var len = Abbozza.ColorNumber;

        var start = generator.fieldToCode(this,"START");
        
        var code = colors + "\n";
        code += "color = strip->mixColors(color,strip->runningPixels(pos,frame," + start + "," + len + ", strip->colors," + reverse + "));";
        
        return code;
    }
};

Blockly.Blocks['mantel_pixel_seq'] = Abbozza.MantelPixelSequenz;


Abbozza.MantelPixelRegenbogen = {
    init: function () {
        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getColor("cat.TEMPLATES"));
        this.appendDummyInput("COLORS")
            .appendField("Lasse einen Regenbogen laufen");
        this.appendDummyInput()
           .setAlign(Blockly.ALIGN_RIGHT)   
           .appendField("Länge")
           .appendField(new Blockly.FieldNumber(20), "LENGTH");
        this.appendDummyInput()
           .setAlign(Blockly.ALIGN_RIGHT)   
           .appendField("Startposition")
           .appendField(new Blockly.FieldNumber(0), "START");
        this.appendDummyInput()
            .appendField("Rückwärts")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldCheckbox(0),"REVERSE");
        this.setInputsInline(false);
        this.setPreviousStatement(true, "TEMPLATE");
        this.setNextStatement(true, "TEMPLATE");
        this.setTooltip('');
    },
    setName: function (name) {
        this.name = name;
    },
    generateCode: function (generator) {
        Abbozza.ColorNumber = 0;
        var colors = generator.statementToCode(this, 'COLORS', "  ");
        var reverse = generator.fieldToCode(this,"REVERSE").toLowerCase();
        var len = generator.fieldToCode(this,"LENGTH");
        var start = generator.fieldToCode(this,"START");
        
        var code = colors + "\n";
        code += "color = strip->mixColors(color,strip->runningRainbow(pos,frame," + start + "," + len + "," + reverse + "));";
        
        return code;
    }
};

Blockly.Blocks['mantel_pixel_regenbogen'] = Abbozza.MantelPixelRegenbogen;
