export var VSToJS = class {
    constructor(stage, layer, variables, isRunOrCode) {
        this.script = '';
        this.nodeCount = 0;
        this.isRunOrCode = isRunOrCode;
        for (let variable in variables) {
            // console.log(variable);
            this.script += `let ${variables[variable].name} = ${variables[variable].value}; // dataType ${variables[variable].dataType} \n`;
        }
        let begin = this.getBegin(stage);
        if (begin) {
            this.coreAlgorithm(begin);
            console.log(this.script);
            if (this.isRunOrCode == "Run") {
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
                    <script>
                    try{
                    ${this.script}
                    }
                    catch{
                        document.write("Error");
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
        else {
            alert("include begin node");
        }
        // console.log(begin);
        // try{
        //     eval(this.script);
        // }
        // catch
        // {
        //     console.log("error");
        // }
    }
    getBegin(stage) {
        let X = stage.findOne("#Begin");
        return X;
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
    getInputPins(node) {
        let X = [];
        for (let aNode of node.customClass.inputPins) {
            if (aNode.wire) {
                X.push({ node: aNode.wire.attrs.src.getParent(), isWire: true });
            }
            else {
                X.push({ node: aNode.textBox.textBox.text(), isWire: false });
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
                this.script += `${node.customClass.type.typeOfNode.slice(4)} = ${this.handleInputs(inputPins[0])}\n`;
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
                case "Log": {
                    if (this.isRunOrCode == "Code") {
                        if (inputPins.length)
                            this.script += `console.log(${this.handleInputs(inputPins[0])});\n`;
                        for (let each of execOutPins) {
                            this.coreAlgorithm(each);
                        }
                    }
                    else {
                        if (inputPins.length)
                            this.script += `document.write(${this.handleInputs(inputPins[0])} + "<br>");\n`;
                        for (let each of execOutPins) {
                            this.coreAlgorithm(each);
                        }
                    }
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
                    let forVar = `i${node.customClass.type.isFor}`;
                    this.script += `for(let ${forVar} = (${this.handleInputs(inputPins[0])}); ${forVar} < (${this.handleInputs(inputPins[1])}); ${forVar} += (${this.handleInputs(inputPins[2])})){\n`;
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
                    this.script += `while(${this.handleInputs(inputPins[0])}){\n`;
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
        if(inputNode.node.customClass.type.isFor)
        {
            return `(i${inputNode.node.customClass.type.isFor})`;
        }
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
            case "OR": {
                expr = `(${this.handleInputs(inputPins[0])} || ${this.handleInputs(inputPins[1])})`;
            }
                break;
            case "NEG": {
                expr = `!(${this.handleInputs(inputPins[0])})`;
            }
                break;
            case "Random": {
                expr = `Math.floor(Math.random())`;
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
        }
        return expr;
    }



};