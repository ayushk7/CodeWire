import {colorMap} from '../ColorMap/colorMap.js'
import {variableList} from '../Variable/variable.js'
import {showAlert} from '../main/alertBox.js'
export class leftPanel {
    constructor() {
        // this.variablesNameList = {};
        document.getElementById("slide-left-panel").addEventListener("click", () => {
            document.getElementById("left-panel").classList.toggle("closed-left-panel");
            document.getElementById("slide-left-panel").children[0].classList.toggle("slider-icon-closed");
        });
        document.getElementById("list-of-variables").addEventListener("click", () => {
            // console.log("clicked");
            // document.getElementById("list-of-variables-down-icon").classList.toggle("list-of-variables-down-icon-closed");
            document.getElementById("list-of-variables-content").classList.toggle("hidden");
            document.getElementById("list-of-variables-down-icon").classList.toggle("left-panel-tab-arrow-up");
        });
        document.getElementById("add-variables").addEventListener("click", () => {
            document.getElementById("add-variables-content").classList.toggle("hidden");
            document.getElementById("add-variables-plus-icon").classList.toggle("left-panel-tab-arrow-up");
        });
        let createVariableForm = document.getElementById("create-variables");
        let forms = {
            numberForm: document.getElementById("number-default-form"),
            stringForm: document.getElementById("string-default-form"),
            boolForm: document.getElementById("bool-default-form"),
            arrayForm: document.getElementById("array-default-form"),
        }
        let formInputsField = {
            numberFormField: document.getElementById("number-default-value"),
            stringFormField: document.getElementById("string-default-value"),
            boolFormField: document.getElementById("bool-default-value"),
            arrayFormField: document.getElementById("array-default-value"),
        }
        let variableDataTypeForm = document.getElementById("variable-data-type");
        variableDataTypeForm.addEventListener("input", (e) => {
            let dataType = variableDataTypeForm.value;
            if (dataType == "Number") {
                for(let each in forms)
                {
                    forms[each].classList.toggle("hidden", true);
                }
                forms.numberForm.classList.toggle("hidden", false);
            }
            else if(dataType == "String"){
                for(let each in forms)
                {
                    forms[each].classList.toggle("hidden", true);
                }
                forms.stringForm.classList.toggle("hidden", false);
            }
            else if(dataType == "Boolean"){
                for(let each in forms)
                {
                    forms[each].classList.toggle("hidden", true);
                }
                forms.boolForm.classList.toggle("hidden", false);
            }
            else if(dataType == "Array"){
                for(let each in forms)
                {
                    forms[each].classList.toggle("hidden", true);
                }
                forms.arrayForm.classList.toggle("hidden", false);
            }
        });
        document.getElementById("create-btn").addEventListener("click", () => {
            let variableName = document.getElementById("variable-name").value;
            if (variableName.length == 0) {
                showAlert("Variable Name Can't be empty!");
            }
            else if (variableList.variables.some(value => value.name == variableName)) {
                showAlert("Variable Already Exist");
            }
            else {
                let value;
                let type = document.getElementById("variable-data-type").value;
                if (type == "Boolean") {
                    value = formInputsField.boolFormField.value;
                }
                else if (type == "Number") {
                    value = formInputsField.numberFormField.value.toString();
                }
                else if(type == "String"){
                    value = formInputsField.stringFormField.value.toString();
                    value = `'${value}'`;
                }
                else if(type == "Array"){
                    value = formInputsField.arrayFormField.value.toString();
                }
                if (value == 0 || value) {
                    let variable = {
                        name: variableName,
                        dataType: document.getElementById("variable-data-type").value,
                        value: value,
                    };
                    // this.variablesNameList[variableName] = variableName;
                    variableList.addVariable(variable);
                    document.getElementById("list-of-variables-content").classList.toggle("hidden", false);
                    document.getElementById("list-of-variables-down-icon").classList.toggle("left-panel-tab-arrow-up", false);
                }
                else {
                    showAlert("Value Can't Be empty");
                }
            }
        });
    }
}
// 'Number': '#00ffff',
//     'String': '#aaff00',
//     'Boolean': '#e60000', 