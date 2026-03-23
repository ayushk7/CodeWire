import { variableList } from '../ui/variableList.js'
import { showAlert } from '../ui/dialogs.js'
import { BuilInFunctions } from './builtInFunctions.js'
import { runExecCodegen, runExprCodegen, hasType } from '../registry/index.js'
import { tabManager } from '../editor/tabManager.js'
export var VSToJS = class {

    constructor(stage, layer, isRunOrCode) {
        this.script = '';
        this.builtin_functions = {};
        this.nodeCount = 0;
        this.isRunOrCode = isRunOrCode;
        this.compileIssues = [];
        this._callCounter = 0;

        this.compileFunctionTabs();

        const mainTab = tabManager.getTab('main');
        const globalVars = mainTab ? mainTab.variables : variableList.variables;
        for (let variable of globalVars) {
            this.script += `let ${variable.name} = ${variable.value};\n`;
        }
        let begin = this.getBegin(stage);
        if (begin) {
            try {
                this.coreAlgorithm(begin);
                if (this.compileIssues.length > 0) {
                    showAlert("Compile failed — fix these issues first:<br>" + this.compileIssues.join("<br>"));
                    this.script = '';
                    return;
                }
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
    compileFunctionTabs() {
        const funcTabs = tabManager.getAllFunctionTabs();
        for (const tab of funcTabs) {
            const funcBegin = tab.layer.findOne('#FunctionBegin');
            if (!funcBegin) continue;

            const params = tab.inputParams.map(p => p.name).join(', ');
            const savedScript = this.script;
            this.script = '';

            if (tab.variables && tab.variables.length > 0) {
                for (const v of tab.variables) {
                    this.script += `let ${v.name} = ${v.value};\n`;
                }
            }

            const execOutPins = this.getExecOut(funcBegin);
            for (let each of execOutPins) {
                this.coreAlgorithm(each);
            }

            const bodyScript = this.script;
            this.script = savedScript;
            this.script += `function ${tab.name}(${params}) {\n${bodyScript}}\n`;
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
                X.push({ node: aNode.wire.attrs.src.getParent(), isWire: true, wire: aNode.wire, srcOutputPinNumber: this.getSrcOutputPinNumber(aNode.wire.attrs.src.getParent(), aNode.wire) });
            }
            else {
                const val = aNode.textBox ? aNode.textBox.textBox.text() : 'undefined';
                X.push({ node: val, isWire: false, wire: null, srcOutputPinNumber: null });
            }
        }
        return X;
    }
    coreAlgorithm(node) {
        if (node == null) return;

        if (node.customClass.isOrphaned) {
            this.compileIssues.push(`Skipped orphaned node: "${node.customClass.type.typeOfNode}"`);
            let execOutPins = this.getExecOut(node);
            for (let each of execOutPins) {
                this.coreAlgorithm(each);
            }
            return;
        }

        const nodeType = node.customClass.type.typeOfNode;

        if (nodeType === 'FunctionBegin') {
            let execOutPins = this.getExecOut(node);
            for (let each of execOutPins) {
                this.coreAlgorithm(each);
            }
            return;
        }

        if (nodeType === 'Return') {
            let inputPins = this.getInputPins(node);
            if (inputPins.length > 0) {
                const nd = node.customClass.nodeDescription;
                const outputNames = [];
                if (nd.inputs) {
                    for (const key of Object.keys(nd.inputs)) {
                        outputNames.push(nd.inputs[key].inputTitle);
                    }
                }
                if (inputPins.length === 1) {
                    this.script += `return ${this.handleInputs(inputPins[0])};\n`;
                } else {
                    const pairs = outputNames.map((name, i) =>
                        `${name}: ${this.handleInputs(inputPins[i])}`
                    ).join(', ');
                    this.script += `return { ${pairs} };\n`;
                }
            } else {
                this.script += `return;\n`;
            }
            return;
        }

        if (nodeType.startsWith('Call ')) {
            let inputPins = this.getInputPins(node);
            let execOutPins = this.getExecOut(node);
            const funcName = node.customClass.nodeDescription.calledFunctionName || nodeType.slice(5);
            const args = inputPins.map(ip => this.handleInputs(ip)).join(', ');
            const varName = `_call_${funcName}_${this._callCounter++}`;
            this.script += `let ${varName} = ${funcName}(${args});\n`;
            node._callResultVar = varName;
            for (let each of execOutPins) {
                this.coreAlgorithm(each);
            }
            return;
        }

        let execOutPins = this.getExecOut(node);
        let inputPins = this.getInputPins(node);
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

        if (inputNode.wire && inputNode.wire.isMismatched) {
            this.compileIssues.push(`Skipped type-mismatched wire connected to "${inputNode.node.customClass.type.typeOfNode}"`);
            return "undefined";
        }

        if (inputNode.node.customClass.isOrphaned) {
            this.compileIssues.push(`Skipped orphaned node: "${inputNode.node.customClass.type.typeOfNode}"`);
            return "undefined";
        }

        const nodeType = inputNode.node.customClass.type.typeOfNode;

        if (nodeType === 'FunctionBegin') {
            const nd = inputNode.node.customClass.nodeDescription;
            if (nd.outputs) {
                const outputKey = `output${inputNode.srcOutputPinNumber}`;
                const paramName = nd.outputs[outputKey]?.outputTitle;
                if (paramName) return paramName;
            }
            return 'undefined';
        }

        if (nodeType.startsWith('Call ')) {
            const resultVar = inputNode.node._callResultVar;
            if (resultVar) {
                const nd = inputNode.node.customClass.nodeDescription;
                if (nd.outputs) {
                    const outputKeys = Object.keys(nd.outputs);
                    if (outputKeys.length === 1) {
                        return resultVar;
                    }
                    const outputName = nd.outputs[`output${inputNode.srcOutputPinNumber}`]?.outputTitle;
                    if (outputName) return `${resultVar}.${outputName}`;
                }
                return resultVar;
            }
            return 'undefined';
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