import {colorMap} from '../ColorMap/colorMap.js'
export class leftPanel {
    constructor() {
        this.variables = {};
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
                alert("Variable Name Can't be empty!");
            }
            else if (this.variables[variableName]) {
                alert("Variable Already Exist");
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
                    value = `"${value}"`;
                }
                else if(type == "Array"){
                    value = formInputsField.arrayFormField.value.toString();
                }
                if (value == 0 || value) {
                    this.variables[variableName] = {
                        name: variableName,
                        dataType: document.getElementById("variable-data-type").value,
                        value: value,
                    };
                    let el = `<li id=${this.variables[variableName].dataType}-${variableName} class="list-group-item mt-2 ms-5 me-5 p-2 ps-3 rounded" style="font-size:15px; border: ${colorMap[this.variables[variableName].dataType]} 2px solid; color: white; background: transparent;">${variableName}
            </li>`;
            //<button type="button" class="btn btn-outline-danger position-absolute end-0 me-1"">Delete</button>
                    document.getElementById("variable-list").innerHTML += el;
                    // <div class="context-menu-items">GetRandom</div>
                    document.getElementById("context-menu").innerHTML += `<div class="context-menu-items" data-datatype=${this.variables[variableName].dataType}>Set ${variableName}</div>`;
                    document.getElementById("context-menu").innerHTML += `<div class="context-menu-items" data-datatype=${this.variables[variableName].dataType}>Get ${variableName}</div>`;

                    // document.querySelector(`#${variables[variableName].dataType}-${variableName} button`).addEventListener("click", (e) => {
                    //     // variables.remove(`${variables[variableName].da}`)
                    //     console.log(e.target.parentElement.innerHTML);
                    //     document.querySelector(`#${variables[variableName].dataType}-${variableName}`).remove();
                    // })
                }
                else {
                    alert("Value Can't Be empty");
                }
            }
        });
    }
}
// 'Number': '#00ffff',
//     'String': '#aaff00',
//     'Boolean': '#e60000', 