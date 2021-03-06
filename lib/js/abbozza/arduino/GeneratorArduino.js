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
 * @fileoverview The Code Generator of Abbozza.
 * 
 * It provides several methods for the generation of code from
 * the blocks.
 * 
 * It allows to add erros, which are diaplayed by icons.
 * 
 * @author michael.brinkmeier@uni-osnabrueck.de (Michael Brinkmeier)
 */

 /**
  * Each value block has to have at most one of the following types:
  * "NUMBER", "STRING", "DECIMAL, "BOOLEAN"
  * 
  * Each block can have the following types in addition:
  * "VAR"
  * 
  * Plug types
  * "ARR_DIM", "VAR_DECL"
  */

/**
 * Definition of the dictionary of reserved words
 */

ReservedWords.list = ",setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto," +
	"#define,#include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,LED_BUILTIN,true,false," +
	"void,boolean,char,unsigned,byte,int,word,long,short,float,double,string,String," +
	"sizeof,PROGMEM,pinMode,digitalWrite,digitalRead,analogReference,analogRead," +
	"analogWrite,analogReadResolution,analogWriteResolutinon,tone,noTone,shiftOut," +
	"shiftIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain," +
	"map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet," +
	"bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts,Serial,Stream,"+
	"Keyboard,Mouse,ISR,F,"+
	"Serial.available,Serial.begin,Serial.end,Serial.find,Serial.findUntil,Serial.flush," +
	"Serial.parseFloat,Serial.parseInt,Serial.peek,Serial.print,Serail.println,Serial.read," +
	"Serial.readBytes,Serial.readBytesUntil,Serial.setTimeout,Serial.write,Serial.serialEvent," +
	"Stream.available,Stream.read,Stream.flush,Stream.find,Stream.findUnti,Stream.peek," +
	"Stream.readBytes,Stream.readBytesUntil,Stream.readString,Stream.readStringUntil,Stream.parseInt," +
	"Stream.parsefloat,Stream.setTimeout," +
	"Mouse.begin,Mouse.click,Mouse.end,Mouse.move,Mouse.press,Mouse.release,Mouse.isPressed," +
	"Keyboard.begin,Keyboard.end,Keyboard.press,Keyboard.print,Keyboard.println,Keyboard.release," +
	"Keyboard.releaseAll,Keyboard.write";

AbbozzaGenerator.prototype.initGenerator_ = function() {
    this.serialRequired = false;
    this.serialParserRequired = false;
    this.parserRequired = false;
    this.startMonitor = false;

    // Sets the list of volatile variables
    this.volatileVars = [];

    // Check if longs should be used
    if ( Configuration.getParameter("option.use_long") == "true" ) {
      setKeyword("NUMBER","long");
    } else {
      setKeyword("NUMBER","int");
    }

    // Check if doubles should be used
    if ( Configuration.getParameter("option.use_double") == "true" ) {
      setKeyword("DECIMAL","double");
    } else {
      setKeyword("DECIMAL","float");
    }
}

/**
 * This operation checks the varios generation options and adds
 * code as needed.
 * 
 * @returns {undefined}
 */
AbbozzaGenerator.prototype.checkOptions_ = function() {
  // Check if the serial connection is required
  if ( (this.serialRequired == true) || (this.parserRequired == true ) || (this.serialParserRequired == true ) ) {
    this.addSetupCode("Serial.begin(" + Abbozza.serialRate + ");",true);
  }

    if ( this.serialParserRequired == true ) {
     this.addLibrary("abbozzaParser.h");
     this.addInitCode("AbbozzaParser __serial_parser = AbbozzaParser();",true);
  }

    if ( this.parserRequired == true ) {
     this.addLibrary("abbozzaStringParser.h");
     this.addInitCode("AbbozzaStringParser __parser = AbbozzaStringParser();",true);
  }

}


/**
 * This operation is the entry point for code generation.
 * It Iterates through the top blocks of the workspace, generates their
 * code and combines it. In addition it adds libraries and additional
 * required statements not directly generated. 
 */
AbbozzaGenerator.prototype.workspaceToCode_ = function(opt_workspace) {
  // Reset generator
  // ErrorMgr.clearErrors();	
  // this.startGenerator = false;
    
  // this.serialRequired = false;
  // this.serialParserRequired = false;
  // this.parserRequired = false;
  // this.startMonitor = false;
  
  // SYS : this.volatileVars = [];
    
  // Check if longs should be used
  // if ( Configuration.getParameter("option.use_long") == "true" ) {
  //     setKeyword("NUMBER","long");
  // } else {
  //     setKeyword("NUMBER","int");
  // }
  
  // Check if doubles should be used
  // if ( Configuration.getParameter("option.use_double") == "true" ) {
  //     setKeyword("DECIMAL","double");
  // } else {
  //     setKeyword("DECIMAL","float");
  // }
  
  // Fetch all blocks from the workspace
  // var workspace = opt_workspace || Blockly.mainWorkspace;
  // this.preSetup = "// preSetup is DEPRECATED!";
  // this.setupHookCode = "";
  // this.libraries = [];
  // this.signatureCode = "";
  // this.blockCode = "";
  // this.mainCode = "";
  // this.deviceCode = "";
  // this.globalVarCode = "";
 
  // var code = this.codeTemplate;

  // Get all top blocks from Workspace
  // var origBlocks = workspace.getTopBlocks(true);

  /**
   * Rearrange the top blocks:
   * blocks[0] : device block if present
   * blocks[1] : main block
   * blocks[i] : function declarations
   * 
   * Initialize device and maion block by null.
   */
  /*
  var blocks = [null,null];   
  for ( var i = 0; i<origBlocks.length; i++) {
    block = origBlocks[i];
    if ( block.type == "devices" ) {
    	blocks[0] = block;
    } else if ( block.type.startsWith("main") ) {
        blocks[1] = block;
    } else if ( block.type == "func_decl") {
        blocks.push(block);
    } else if ( block.type == "int_isr") {
        blocks.push(block);
    }
  }
  */
 
  // Iterate backward through the blocks and generate the code
  // The main block is treated last, since the isr blocks are scanned for
  // the usage of global variables, which have to be declared "volatile"
  /*
  for (var x = blocks.length-1; x >= 0; x--) {
    var block = blocks[x];
    if ( block ) {  // catching missing device block
        var line = this.topBlockToCode(block, "");
        if (line) {
          // Seperate operation blocks
          if ( (block.type == "func_decl") || (block.type == "int_isr") ) {
            this.blockCode = this.blockCode + line;
          } else if (block.type == "devices") {
            this.deviceCode = this.deviceCode + line;                    
          } else {
            this.mainCode = this.mainCode + line;
          }
        }
    }  
  }
  */
 
  // replace block tags
  // code = code.replace(/###globalvars###/g, this.globalVarCode);
  // code = code.replace(/###main###/g, this.mainCode);
  // code = code.replace(/###blocks###/g, this.blockCode);
  // code = code.replace(/###devices###/g, this.deviceCode);
   
  // Check if some block requires the initialization of the serial communication.
  // If yes, add the code:
  // Serial.begin( <rate> );
  // if ( (this.serialRequired == true) || (this.parserRequired == true ) ) {
  //   this.setupHookCode = this.setupHookCode + "\nSerial.begin(" + Abbozza.serialRate + ");" + "\n";
  // }

  // if ( this.serialParserRequired == true ) {
  //    this.addLibrary("abbozzaParser.h");
  //    this.addInitCode("AbbozzaParser __serial_parser = AbbozzaParser();");
  // }

  // if ( this.parserRequired == true ) {
  //    this.addLibrary("abbozzaStringParser.h");
  //    this.addInitCode("AbbozzaStringParser __parser = AbbozzaStringParser();");
  // }
  
  // Replace the ###inithook###
  // code = code.replace(/###inithook###/g,this.initHookCode);

  // Add the setuphook for other blocks.
  // Each block may add some code to the setuphook. It is added in the 
  // order the blocks are called to generate their code.
  // this.setupHookCode = this.setupHookCode.replace(/\n/g,"\n   ");
  // this.setupHookCode = this.setupHookCode + "\n";
  
  // Replace the setuphook by the constructed code.
  // code = code.replace(/###setuphook###/g,this.setupHookCode);
 
  // var acode = "";
  // if (this.libraries.length != 0 ) {
  //   for (var i = 0; i < this.libraries.length; i++) {
  //     acode = acode + "#include <" + this.libraries[i] + ">\n";
  //   }
  //   acode = acode + "\n";
  // }
  // code = code.replace(/###libraries###/g,this.getLibrariesCode());

  // Final scrubbing of whitespace.
  // code = code.replace(/^\s+\n/, '');
  // code = code.replace(/\n\s+$/, '\n');
  // code = code.replace(/[ \t]+\n/g, '\n');

  // console.log(code);
  
  return code;
};


/**
 * Prepend the generated code with a general
 * comment, required libraries and pre setup code.
 * 
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
AbbozzaGenerator.prototype.finish = function(code) {
       // Generate the general comment    
       acode = "/**\n" +
	       " *  Generated by abbozza!\n" +
	       " */\n\n";
       
       // Add required libraries.
       if (this.libraries.length != 0 ) {
           acode = acode + "/*\n * Bibliotheken\n */\n";
           for (var i = 0; i < this.libraries.length; i++) {
               acode = acode + "#include <" + this.libraries[i] + ">\n";
           }
           acode = acode + "\n";
       }
       
       // Add pre setup code
       // if (this.preSetup != "" ) {
       //    acode = acode + "/*\n * Vorbereitungen\n */\n" + this.preSetup + "\n\n";
       // }    
       // return acode + code;
};


/**
 * Add a required library
 * 
 * Moved to common generator
 */
// AbbozzaGenerator.prototype.addLibrary = function(lib) {
//         for (var i = 0; i < this.libraries.length; i++ ) {
//             if (this.libraries[i] == lib) return;
//        }
// 	this.libraries.push(lib);
// }


/**
 * Generates a string for a symbol of the form
 * <type> <name><arraydim> \t //<comment>
 */
AbbozzaGenerator.prototype.symbolToCode = function(symbol) {
    var name = symbol[0];
    var type = symbol[1];
    var len = symbol[2];

    var code = keyword(type) + " " + name + Abbozza.lenAsString(len);

    var volatile = false;
    var i = 0;
    while ( (i < this.volatileVars.length) && (volatile == false)) {
         if ( this.volatileVars[i] == name ) volatile = true;
         i++;
    }
    
    if (volatile) code = "volatile " + code;
    
    return code;
}


    
/**
 * Generates the list of variables in the symbolDB of the form
 * <type> <name><dimension>;
 * <type> <name><dimension>;
 * ...
 */
AbbozzaGenerator.prototype.variablesToCode = function(symbols,prefix) {
    var code = "";
    var variables = symbols.getVariables(true);
    for ( var i = 0; i < variables.length; i++ ) {
        var entry = variables[i];
 	code = code + prefix + this.symbolToCode(entry) + ";"; // keyword(entry[1]) + " " + entry[0] + Abbozza.lenAsString(entry[2]) + ";";
        
        if (( entry[4] != "") && (entry[4] != null)) 
            code = code + "\t// " + entry[4].replace(/\n/g," ");
        code = code + "\n";
    }
    return code;
}

/**
 * Generates a list of parameters for functions.
 */
AbbozzaGenerator.prototype.parametersToCode = function(symbols,prefix) {
    var parameters = symbols.getParameters(true);
    var pars = "";
    var entry;
    
    if (parameters.length > 0) {
        entry = parameters[0];
        pars = " " + this.symbolToCode(entry); // keyword(entry[1]) + " " + entry[0] + Abbozza.lenAsString(entry[2]);
        // pars = " " + keyword(entry[1]) + " " + entry[0] + Abbozza.lenAsString(entry[2]);
        if (entry[4] != null && entry[4] != "") {
            pars = pars + "\t// " + entry[4].replace(/\n/g, " ");
        }
        for (var i = 1; i < parameters.length; i++) {
            entry = parameters[i];
            pars = pars + ",\n" + prefix + "  " + this.symbolToCode(entry); // keyword(entry[1]) + " " + entry[0] + Abbozza.lenAsString(entry[2]);
            if (entry[4] != null && entry[4] != "") {
                pars = pars + "\t// " + entry[4].replace(/\n/g, " ");
            }
        }
        pars = pars + " )\n";
    } else {
        pars = ")\n";
    }
    
    return pars;
}

/**
 * This operation adds a type cast to the given code.
 */
AbbozzaGenerator.prototype.enforceType = function(code,enfType) {
	switch(enfType) {
		case "NUMBER":
			code = keyword("NUMBER") + "(" + code +")";
			break;
		case "TEXT":
		case "STRING":
			code = "String(" + keyword("NUMBER") + "(" + code +"))";
			break;
		case "DECIMAL":
			code = "" + keyword("DECIMAL") + "(" + code +")";
			break;
		case "BBOLEAN":
			code = "boolean(" + keyword("NUMBER") + "(" + code +") != 0 )";
			break;
	}	
        return code;
}


/**
 * The keywords for abbozza! labels
 */
__keywords = [
		["VOID","void"],
		["NUMBER","int"],
		["STRING","String"],
		["DECIMAL","double"],
		["BOOLEAN","boolean"],
		["TRUE","true"],
		["FALSE","false"],
		["AND","&&"],
		["OR","||"],
		["EQUALS","=="],
		["INEQUAL","!="],
		["LESS","<"],
		["LESSEQ","<="],
		["GREATER",">"],
		["GREATEREQ",">="],		
		["ABS", "abs"],
		["SQRT", "sqrt"],
		["SIN", "sin"], 
		["COS", "cos"],
		["TAN", "tan"],
		["MIN", "min"],
		["MAX", "max"],
		["PLUS", "+"],
		["MINUS", "-"],
		["MULT", "*"],
		["DIV", "/"],
		["MOD", "%"],
		["POWER", "^"]
	];
__dict = __keywords;

