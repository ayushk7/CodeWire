import { variableList } from '../ui/variableList.js'
import { showAlert } from '../ui/dialogs.js'
import { BuilInFunctions } from './builtInFunctions.js'
import { runExecCodegen, runExprCodegen, hasType } from '../registry/index.js'
export var VSToJS = class {

    constructor(stage, layer, isRunOrCode) {
        this.script = '';
        this.builtin_functions = {};
        this.nodeCount = 0;
        this.isRunOrCode = isRunOrCode;
        for (let variable of variableList.variables) {
            // console.log(variable);
            this.script += `let ${variable.name} = ${variable.value};\n`;
        }
        let begin = this.getBegin(stage);
        if (begin) {
            try {
                this.coreAlgorithm(begin);
                // console.log(this.script);
                if (this.isRunOrCode == "Run") {
                    document.getElementById("console-window").classList.toggle("hidden", false);
                    let codeDoc = document.getElementById("console").contentWindow.document;
                    // console.log("run");
                    codeDoc.open();
                    codeDoc.writeln(
                        `<!DOCTYPE html>\n
                    <style>
                        html{
                            color: white;
                            margin: 20;
                        }
                    </style>
                    <body>
                    <p id="myLog"></p>
                    </body>
                    <script>
                    window.parent = null;
                    window.top = null;
                    window.console = {
                        log: function(str){
                          var node = document.createElement("div");
                          node.appendChild(document.createTextNode(JSON.stringify(str)));
                          document.getElementById("myLog").appendChild(node);
                        }
                      }
                    try{
                    ${this.script}
                    }
                    catch(err){
                        console.log("Error");
                        console.log(\`\${err}\`);
                    }
                    </script>
                    </html>
                    `
                    );
                    codeDoc.close();
                }
            }
            catch (err) {
                document.getElementById("console-window").classList.toggle("hidden", false);
                let codeDoc = document.getElementById("console").contentWindow.document;
                this.script = '';
                this.builtin_functions = {};
                codeDoc.open();
                codeDoc.writeln(
                    `<!DOCTYPE html>\n
                    <style>
                        html{
                            color: white;
                            margin: 20;
                        }
                    </style>
                    <body>
                    <code>
                    Recheck the nodes <br>
                    ${err.name === 'RangeError' ? 'CyclicDependence : Irresolvable Cycle(s) Exists' : `UnknownException: Improve The Editor By Opening Issue On GitHub(Just Attach The Exported Graph)`}
                    </code>
                    </body>
                    </html>
                    `
                );
            }
        }
    }
    getBegin(stage) {
        let X = stage.find("#Begin");
        if (X.length == 0) {
            showAlert("Include Begin Node");
        }
        else if (X.length > 1) {
            showAlert("Multiple Begin Nodes");
        }
        else return X[0];
    }
    getExecOut(node) {
        let X = [];
        for (let aNode of node.customClass.execOutPins) {
            if (aNode.wire)
                X.push(aNode.wire.attrs.dest.getParent());
            else
                X.push(null);
        }
        // console.log(X);
        return X;
    }
    getSrcOutputPinNumber(grp, aNodeWire) {
        let c = 0;
        for (let eachPin of grp.customClass.outputPins) {
            for (let aWire of eachPin.wire) {
                if (aWire === aNodeWire) {
                    return c;
                }
            }
            c++;
        }
    }
    getInputPins(node) {
        let X = [];
        for (let aNode of node.customClass.inputPins) {
            if (aNode.wire) {
                X.push({ node: aNode.wire.attrs.src.getParent(), isWire: true, srcOutputPinNumber: this.getSrcOutputPinNumber(aNode.wire.attrs.src.getParent(), aNode.wire) });
            }
            else {
                // console.log(aNode.textBox);
                X.push({ node: aNode.textBox.textBox.text(), isWire: false, srcOutputPinNumber: null });
            }
        }
        return X;
    }
    coreAlgorithm(node) {
        if (node == null) return;
        let execOutPins = this.getExecOut(node);
        let inputPins = this.getInputPins(node);
        // console.log(node.customClass.type);
        // console.log(inputPins);
        if (node.customClass.type.isGetSet) {
            if (node.customClass.type.typeOfNode.slice(0, 3) == 'Set') {
                this.script += `${node.customClass.type.typeOfNode.slice(4)} = ${this.handleInputs(inputPins[0])};\n`;
                for (let each of execOutPins) {
                    this.coreAlgorithm(each);
                }
            }
        } else {
            const type = node.customClass.type.typeOfNode;
            if (hasType(type)) {
                runExecCodegen(type, this, node);
            }
        }
    }
    handleInputs(inputNode) {

        if (!inputNode.isWire) {
            return inputNode.node;
        }
        let inputPins = this.getInputPins(inputNode.node);
        if (inputNode.node.customClass.type.isGetSet) {
            return `${inputNode.node.customClass.type.typeOfNode.slice(4)}`;
        }
        const type = inputNode.node.customClass.type.typeOfNode;
        if (hasType(type)) {
            const result = runExprCodegen(type, this, inputNode);
            if (result !== undefined) return result;
        }
        return '';
    }



};