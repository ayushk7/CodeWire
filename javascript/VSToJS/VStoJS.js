import { variableList } from '../Variable/variable.js'
import {showAlert} from '../main/alertBox.js'
export var VSToJS = class {
    constructor(stage, layer, isRunOrCode) {
        this.script = '';
        this.nodeCount = 0;
        this.isRunOrCode = isRunOrCode;
        for (let variable of variableList.variables) {
            // console.log(variable);
            this.script += `let ${variable.name} = ${variable.value};`;
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
                else {
                    document.getElementById("console-window").classList.toggle("hidden", false);
                    let codeDoc = document.getElementById("console").contentWindow.document;
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
                    ${this.script}
                    </code>
                    </body>
                    </html>
                    `
                    );
                    codeDoc.close();
                }
            }
            catch (err) {
                document.getElementById("console-window").classList.toggle("hidden", false);
                let codeDoc = document.getElementById("console").contentWindow.document;
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
                    ${err}
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
        if(X.length == 0)
        {
            showAlert("Include Begin Node");
        }
        else if(X.length > 1)
        {
            showAlert("Multiple Begin Nodes");
        }
        else return X[0];
    }
    getExecOut(node) {
        let X = [];
        for (let aNode of node.customClass.execOutPins) {
            if (aNode.wire)
                X.push(aNode.wire.attrs.dest.getParent());
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
        }
        else {
            switch (node.customClass.type.typeOfNode) {
                case "Begin": {
                    for (let each of execOutPins) {
                        this.coreAlgorithm(each);
                    }
                }
                    break;
                case "Print": {
                    // if (this.isRunOrCode == "Code") {
                    if (inputPins.length)
                        this.script += `console.log(${this.handleInputs(inputPins[0])});
                         `;
                    for (let each of execOutPins) {
                        this.coreAlgorithm(each);
                    }
                    // }
                    // else {
                    //     if (inputPins.length)
                    //         this.script += `document.write(${this.handleInputs(inputPins[0])} + "<br>");\n`;
                    //     for (let each of execOutPins) {
                    //         this.coreAlgorithm(each);
                    //     }
                    // }
                }
                    break;
                case "Branch": {
                    this.script += `if(${this.handleInputs(inputPins[0])}){\n`;
                    let ifWasValid = false;
                    if (node.customClass.execOutPins[0].wire) {
                        this.coreAlgorithm(execOutPins[0]);
                        ifWasValid = true;
                    }
                    this.script += `}\n`;
                    let elseWire = (ifWasValid) ? 1 : 0;
                    if (node.customClass.execOutPins[1].wire) {
                        this.script += `else{\n`;
                        this.coreAlgorithm(execOutPins[elseWire]);
                        this.script += `}\n`;
                    }
                }
                    break;
                case "For": {
                    let forVar = `i${node._id}`;
                    this.script += `let __loop__control__${node._id} = 0;
                    for(let ${forVar} = (${this.handleInputs(inputPins[0])}); ${forVar} < (${this.handleInputs(inputPins[1])}); ${forVar} += (${this.handleInputs(inputPins[2])})){\n
                        __loop__control__${node._id}++; 
                        if(__loop__control__${node._id} > 100000){
                            console.log("The program is taking too long in your program  !!Breaking");
                            break;
                        }
                        `;
                    let hasBody = false;
                    if (node.customClass.execOutPins[0].wire) {
                        this.coreAlgorithm(execOutPins[0]);
                        hasBody = true;
                    }
                    this.script += `}\n`;
                    if (node.customClass.execOutPins[1].wire) {
                        this.coreAlgorithm(execOutPins[(hasBody) ? 1 : 0]);
                    }
                }
                    break;
                case "Break": {
                    this.script += `break;\n`;
                }
                    break;
                case "While": {
                    this.script += `let __loop__control__${node._id} = 0;
                                     while(${this.handleInputs(inputPins[0])}){ 
                                         __loop__control__${node._id}++; 
                                        if(__loop__control__${node._id} > 100000){
                                            console.log("The program is taking too long in your program  !!Breaking");
                                            break;
                                        }
                                        \n`;
                    let hasBody = false;
                    if (node.customClass.execOutPins[0].wire) {
                        this.coreAlgorithm(execOutPins[0]);
                        hasBody = true;
                    }
                    this.script += `}\n`;
                    if (node.customClass.execOutPins[1].wire) {
                        this.coreAlgorithm(execOutPins[(hasBody) ? 1 : 0]);
                    }
                }
                    break;
                case "SetByPos": {
                    this.script += `${this.handleInputs(inputPins[2])}[${this.handleInputs(inputPins[0])}] = ${this.handleInputs(inputPins[1])};\n`;
                    if (node.customClass.execOutPins[0].wire) {
                        this.coreAlgorithm(execOutPins[0]);
                    }
                }
                    break;
                case "PushBack": {
                    this.script += `${this.handleInputs(inputPins[1])}.push(${this.handleInputs(inputPins[0])});\n`;
                    if (node.customClass.execOutPins[0].wire) {
                        this.coreAlgorithm(execOutPins[0]);
                    }
                }
                    break;
                case "PushFront": {
                    this.script += `${this.handleInputs(inputPins[1])}.unshift(${this.handleInputs(inputPins[0])});\n`;
                    if (node.customClass.execOutPins[0].wire) {
                        this.coreAlgorithm(execOutPins[0]);
                    }
                }
                    break;
                case "PopBack": {
                    this.script += `${this.handleInputs(inputPins[0])}.pop();\n`;
                    if (node.customClass.execOutPins[0].wire) {
                        this.coreAlgorithm(execOutPins[0]);
                    }
                }
                    break;
                case "PopFront": {
                    this.script += `${this.handleInputs(inputPins[0])}.shift();\n`;
                    if (node.customClass.execOutPins[0].wire) {
                        this.coreAlgorithm(execOutPins[0]);
                    }
                }
                    break;
                case "Insert": {
                    this.script += `${this.handleInputs(inputPins[2])}.splice(${this.handleInputs(inputPins[0])}, 0, ${this.handleInputs(inputPins[1])});\n`;
                    if (node.customClass.execOutPins[0].wire) {
                        this.coreAlgorithm(execOutPins[0]);
                    }
                }
                    break;
                case "Swap": {
                    this.script += `
                        let __tmp__${node._id} = ${this.handleInputs(inputPins[0])};\n
                        ${this.handleInputs(inputPins[0])} = ${this.handleInputs(inputPins[1])};\n
                        ${this.handleInputs(inputPins[1])} = __tmp__${node._id};\n
                    `;
                    if (node.customClass.execOutPins[0].wire) {
                        this.coreAlgorithm(execOutPins[0]);
                    }
                }
                    break;
            }
        }
    }
    handleInputs(inputNode) {

        if (!inputNode.isWire) {
            return inputNode.node;
        }
        let inputPins = this.getInputPins(inputNode.node);
        if (inputNode.node.customClass.type.isGetSet) {
            return `(${inputNode.node.customClass.type.typeOfNode.slice(4)})`;
        }
        // if (inputNode.node.customClass.type.isFor) {
        //     return `(i${inputNode.node.customClass.type.isFor})`;
        // }
        let expr = ``;
        switch (inputNode.node.customClass.type.typeOfNode) {
            case "Add": {
                expr = `(${this.handleInputs(inputPins[0])} + ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "Subtract": {
                expr = `(${this.handleInputs(inputPins[0])} - ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "Multiply": {
                expr = `(${this.handleInputs(inputPins[0])} * ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "Divide": {
                expr = `(${this.handleInputs(inputPins[0])} / ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "Modulo": {
                expr = `(${this.handleInputs(inputPins[0])} % ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "AND": {
                expr = `(${this.handleInputs(inputPins[0])} && ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "Ceil": {
                expr = `(Math.ceil(${this.handleInputs(inputPins[0])}))`;
            }
                break;
            case "Floor": {
                expr = `Math.floor((${this.handleInputs(inputPins[0])}))`;
            }
                break;
            case "OR": {
                expr = `(${this.handleInputs(inputPins[0])} || ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "XOR": {
                expr = `(${this.handleInputs(inputPins[0])} ^ ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "NEG": {
                expr = `!(${this.handleInputs(inputPins[0])})`;
            }
                break;
            case "bAND": {
                expr = `(${this.handleInputs(inputPins[0])} & ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "bOR": {
                expr = `(${this.handleInputs(inputPins[0])} | ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "bXOR": {
                expr = `(${this.handleInputs(inputPins[0])} ^ ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "bNEG": {
                expr = `~(${this.handleInputs(inputPins[0])})`;
            }
                break;
            case "Random": {
                expr = `(Math.random())`;
            }

                break;
            case "Equals": {
                expr = `(${this.handleInputs(inputPins[0])} == ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "LessEq": {
                expr = `(${this.handleInputs(inputPins[0])} <= ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "Less": {
                expr = `(${this.handleInputs(inputPins[0])} < ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "Greater": {
                expr = `(${this.handleInputs(inputPins[0])} > ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "GreaterEq": {
                expr = `(${this.handleInputs(inputPins[0])} >= ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "Length": {
                expr = `(${this.handleInputs(inputPins[0])}.length)`;
            }
                break;
            case "GetByPos": {
                // console.log("GetByPos");
                expr = `(${this.handleInputs(inputPins[1])}[${this.handleInputs(inputPins[0])}])`;
            }
                break;
            case "SetByPos": {
                expr = `(${this.handleInputs(inputPins[2])}[${this.handleInputs(inputPins[0])}])`;
            }
                break;
            case "isEmpty": {
                expr = `(${this.handleInputs(inputPins[0])}.length == (0))`;
            }
                break;
            case "PushBack": {
                expr = `(${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "PushFront": {
                expr = `(${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "PopBack": {
                expr = `(${this.handleInputs(inputPins[0])})`;
            }
                break;
            case "PopFront": {
                expr = `(${this.handleInputs(inputPins[0])})`;
            }
                break;
            case "Front": {
                expr = `(${this.handleInputs(inputPins[0])}[0])`;
            }
                break;
            case "Back": {
                expr = `(${this.handleInputs(inputPins[0])}[${this.handleInputs(inputPins[0])}.length - 1])`;
            }
                break;
            case "Insert": {
                expr = `(${this.handleInputs(inputPins[2])})`;
            }
                break;
            case "Swap": {
                expr = `(${this.handleInputs(inputPins[inputNode.srcOutputPinNumber])})`;
            }
                break;
            case "For": {
                expr = `(i${inputNode.node._id})`;
            }
        }
        return expr;
    }



};