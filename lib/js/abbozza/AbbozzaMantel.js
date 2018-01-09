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

Connection.getText = function (path, successHandler, errorHandler) {
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
}

/**
 * Initialization of Abbozza
 */
Abbozza.init = function (systemPrefix, devAllow, helpUrl) {
    
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
    Connection.getXML("/abbozza/load?http://localhost:54242/sketches/start.abz",
      function(sketch) {
        if (sketch != null) {
            Abbozza.setSketch(sketch);
        } else {
            Abbozza.reloadSketch("/abbozza/load?http://localhost:54242/sketches/start.abz");
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
