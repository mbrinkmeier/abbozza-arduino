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
 * @fileoverview The block for the main operations setup() and loop().
 * It includes the definition of global variables.
 * 
 * @author michael.brinkmeier@uni-osnabrueck.de (Michael Brinkmeier)
 */

Abbozza.FuncMainMantel = {
    title: "<title>",
    symbols: null,
    // test: "",

    init: function () {
        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getCatColor("cat.VAR"));
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.appendDummyInput().appendField(_("LOOP"));
        this.appendStatementInput("LOOP_STATEMENTS")
                .setCheck("STATEMENT");
        this.setTooltip('');
        this.setDeletable(false);
    },

    setSymbolDB: function (db) {
        this.symbols = db;
    },
    setTitle: function (title) {
        // this.title = title;
        // this.getField_("TITLE").setText(title);
   },
    compose: function (topBlock) {
        Abbozza.composeSymbols(topBlock, this);
    },
    decompose: function (workspace) {
        return Abbozza.decomposeSymbols(workspace, this, _("GLOBALVARS"), false);
    },
    generateSetupCode: function (generator) {
        return "";
    },
    generateCode: function (generator) {
        var code = "";
         
//        // Generate code for global variables
//        var code = "";
//        var var_code = generator.variablesToCode(this.symbols, "");
//
//        console.log(generator.volatileVars);
//        
//        if (var_code != "") {
//            code = "/*\n * Globale Variablen\n */\n";
//            code = code + var_code + "\n";
//        }
//
//        var setup_statements = generator.statementToCode(this, 'SETUP_STATEMENTS', "   ");
//        setup_statements = setup_statements.trim();
//
//        code = code + "/* \n * Die setup Operation\n */\n";
//        code = code + "void setup() {\n";
//        code = code + "   ###setuphook###";
//        code = code + Abbozza.blockMain.generateSetupCode(generator);
//        code = code + setup_statements;
//        code = code + "\n}\n\n\n";
//
        var loop_statements = generator.statementToCode(this, 'LOOP_STATEMENTS', "   ");
        code = code + loop_statements;
//
//        code = code + "/*\n * Die Hauptschleife\n */\n";
//        code = code + "void loop() {\n";
//
//        code = code + loop_statements;
//
//        code = code + "\n}\n";

        return code;
    },
    check: function (block) {
        return "Test";
    },
    mutationToDom: function () {
        var mutation = document.createElement('mutation');
        // var title = document.createElement('title');
        // title.appendChild(document.createTextNode(this.title));
        // mutation.appendChild(title);
        if (this.symbols)
            mutation.appendChild(this.symbols.toDOM());
        return mutation;
    },
    
    domToMutation: function (xmlElement) {
        var child;
        for (var i = 0; i < xmlElement.childNodes.length; i++) {
            child = xmlElement.childNodes[i];
            if (child.tagName == 'symbols') {
                if (this.symbols == null) {
                    this.setSymbolDB(new SymbolDB(null, this));
                }
                this.symbols.fromDOM(child);
            // } else if (child.tagName == 'title') {
            //    this.setTitle(child.textContent);
            }
        }
    }
};


Blockly.Blocks['main'] = Abbozza.FuncMainMantel;

