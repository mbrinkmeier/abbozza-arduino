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



/*Connection.getText = function (path, successHandler, errorHandler) {
    if (window.XMLHttpRequest)
        xhttp = new XMLHttpRequest();
    else // code for IE5 and IE6
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xhttp.onload = function () {
        if (xhttp.status == 200) {
            if (successHandler)
                successHandler(this.responseText);
        } else {
            if (errorHandler)
                errorHandler(this.responseText);
        }
    }

    xhttp.open("GET", path, true);
    xhttp.setRequestHeader("Cache-Control","no-cache");
    xhttp.setRequestHeader("Cache-Control","no-store");
    xhttp.setRequestHeader("Cache-Control","must-revalidate");
    xhttp.setRequestHeader("Cache-Control","max-age=0");
    xhttp.send();
    // xhttp.responseType = "";

    return xhttp.responseText;
}*/

function enterFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}
Abbozza.startSketch = "sequenz.abz";

/**
 * Initialization of Abbozza
 */
Abbozza.init = function (systemPrefix, devAllow, helpUrl) {
    
    var div = document.getElementById("workspace");
    enterFullscreen(div);
    // div.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    // div.mozRequestFullScreen();
    // div.msRequestFullscreen();
    // div.requestFullscreen();

    console.log("abbozza! Science Truck Mantel");
    
    if ( typeof helpUrl != "undefined" ) {
        this.HELP_URL = helpUrl;
    }
    
    this.systemPrefix = systemPrefix;
    if ( devAllow ) this.devicesAllowed = devAllow;
    
    this.pathPrefix = this.systemPrefix+"/";        

    window.name = "abbozzaWorkspace";

    // Check APIs
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    /**
     * Disable context menu of browser
     */
    document.oncontextmenu = function(event) { return false; }
    
    /**
     * Adding String.prototype.startsWith for JavaFX WebEngine
     */
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(searchString, position) {
            position = position || 0;
            return this.indexOf(searchString, position) === position;
        };
    }
   
    // 
    // --- not needed ?! ---
    // Initialize DraggingManager
    // this.Dragger.init();
    // ------

    Board.init(this.systemPrefix);

    ColorMgr.resetColors();

    Configuration.load();
    
    TaskWindow.init();
   
    Blockly.bindEvent_(document, 'blocklySelectChange', null,
            Abbozza.changeSelection);
    Blockly.addChangeListener(Abbozza.onChange);
    window.Blockly = Blockly;
    
    but = document.getElementById("upload");
    but.setAttribute("title", _("gui.upload_button"));
    but = document.getElementById("new");
    but.setAttribute("title", _("gui.new_button"));
    but = document.getElementById("info");
    but.setAttribute("title", _("gui.info_button"));
    
    Abbozza.buildToolsMenu();
    
    // Check request for query
    if (window.location.search != "") {
        // A sketch should be loaded from sketchPath
        var sketchPath = "/abbozza/load?http://localhost:54242" + window.location.search.substring(1);
        Connection.getXML(sketchPath,
                function (response) {
                 if (response != null) {
                     Abbozza.setSketch(response,window.location.hash.substr(1));
                 } else {
                     Abbozza.reloadSketch(sketchPath);
                 }
                },
                function (response) {
                    Abbozza.openOverlay(_("msg.invalid_sketch", args))
                    Abbozza.overlayWaitForClose();
                    Abbozza.resetSketch();
                }
        );
    } else {
        console.log("Load default sketch");
        // Inject starting Blocks
        Abbozza.resetSketch();
    }

    // Abbozza.Generator.init();
    
    var generator = Abbozza.Generator;
   
    Connection.getText("js/abbozza/" + Abbozza.systemPrefix + "/code_template",
     function(text) {
       generator.codeTemplate = text;
       console.log("abbozza! : Code Template found!")
     }, 
     function(text) {
       console.log("abbozza! : No code Template found at js/abbozza/" + Abbozza.systemPrefix + "/code_template");
       generator.codeTemplate = text;
       console.log(text);
     }) 
    
    // Load the start sketch
    // Abbozza.resetSketch();
};


/**
 * This Operation resets the sketch.
 */
Abbozza.resetSketch = function() {
    Connection.getXML("/abbozza/load?http://localhost:54242/sketches/" + Abbozza.startSketch,
      function(sketch) {
        if (sketch != null) {
            Abbozza.setSketch(sketch);
        } else {
            Abbozza.reloadSketch("/abbozza/load?http://localhost:54242/sketches/" + Abbozza.startSketch);
       }
      },
      function(sketch) {
        Abbozza.openOverlay("Konnte Start-Sketch nicht laden!");
        Abbozza.overlayWaitForClose();
        Abbozza.newSketch();
      })
}

/**
 * This Operation resets the sketch.
 */
Abbozza.reloadSketch = function(path) {
    Connection.getXML(path,
      function(sketch) {
        if (sketch != null) {
          Abbozza.setSketch(sketch);
       } else {
          Abbozza.resetSketch(path);         
       }
      },
      function(sketch) {
        Abbozza.openOverlay("Konnte Start-Sketch nicht laden!");
        Abbozza.overlayWaitForClose();
        Abbozza.newSketch();
      })
}


Abbozza.setBlocks = function (xml) {
    this.clear();

    this.missingBlocks = [];
    
    Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);

    if ( this.missingBlocks.length > 0 ) {
        Abbozza.openOverlay(_("gui.unknown_blocks"));
        Abbozza.overlayWaitForClose();
    }
    
    // Run through topBlocks and get everything right
    var topBlocks = Blockly.mainWorkspace.getTopBlocks();
    
    for (var i = 0; i < topBlocks.length; i++) {
        if (topBlocks[i].type.startsWith("main")) {
            this.blockMain = topBlocks[i];
            this.globalSymbols = topBlocks[i].symbols;
            Blockly.mainWorkspace.symbols = this.globalSymbols;
        } else if (topBlocks[i].type == "devices") {
            this.blockDevices = topBlocks[i];
        }
    }

    if ( this.blockMain == null ) {
        this.blockMain = Blockly.mainWorkspace.newBlock("main");
        this.blockMain.setPreviousStatement(false);
        this.blockMain.setSymbolDB(this.globalSymbols);
        this.blockMain.initSvg();
        this.blockDevices.moveBy(20,20);
    }
    
    for (i = 0; i < topBlocks.length; i++) {
        if (topBlocks[i].type == "func_loop") {
            this.globalSymbols.addFunction("loop", "VOID", null);
            this.globalSymbols.addChild(topBlocks[i].symbols, "loop");
        } else if (topBlocks[i].type == "func_setup") {
            this.globalSymbols.addFunction("setup", "VOID", null);
            this.globalSymbols.addChild(topBlocks[i].symbols, "setup");
        } else if (topBlocks[i].type == "func_decl") {
            var name = topBlocks[i].name;
            this.globalSymbols.addChild(topBlocks[i].symbols, name);
        }

    }

    var ww = Blockly.mainWorkspace.getWidth();

    this.blockLogo = null;
    this.blockConf = null;

    var blocks = Blockly.mainWorkspace.getAllBlocks();
    for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].onload) {
            blocks[i].onload();
        }
    }
    Blockly.mainWorkspace.render();
}