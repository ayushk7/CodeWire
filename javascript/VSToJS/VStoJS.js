export var VSToJS = class {
    constructor(stage, layer, variables) {
        this.script = '';
        for (let variable in variables) {
            // console.log(variable);
            this.script += `let ${variables[variable].name} = ${variables[variable].value}; // dataType ${variables[variable].dataType} \n`;
        }
        let begin = this.getBegin(stage);
        this.coreAlgorithm(begin);
        // console.log(begin);
        console.log(this.script);
        try{
            eval(this.script);
        }
        catch
        {
            console.log("error");
        }
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
                // console.log(aNode);
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
                    if (inputPins.length)
                        this.script += `console.log(${this.handleInputs(inputPins[0])});\n`;
                    for (let each of execOutPins) {
                        this.coreAlgorithm(each);
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
                    this.script += `for(let i = (${this.handleInputs(inputPins[0])}); i < (${this.handleInputs(inputPins[1])}); i += (${this.handleInputs(inputPins[2])})){\n`;
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
            case "For": {
                expr = `(i)`;
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