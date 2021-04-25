export class leftPanel {
    constructor() {
        this.variables = {};
        let createVariableForm = document.getElementById("create-variables");

        let variableDataTypeForm = document.getElementById("variable-data-type");
        variableDataTypeForm.addEventListener("input", (e) => {
            let dataType = variableDataTypeForm.value;
            if (dataType == "Boolean") {
                document.getElementById("non-bool-default-form").style.display = "none";
                document.getElementById("bool-default-form").style.display = "flex";
            }
            else {
                document.getElementById("non-bool-default-form").style.display = "flex";
                document.getElementById("bool-default-form").style.display = "none";
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
                    value = parseInt(document.getElementById("variable-bool-default-value").value);
                }
                else if (type == "Number") {
                    value = parseInt(document.getElementById("variable-default-value").value);
                }
                else {
                    value = document.getElementById("variable-default-value").value.toString();
                    value = `"${value}"`;
                }
                if (value == 0 || value) {
                    this.variables[variableName] = {
                        name: variableName,
                        dataType: document.getElementById("variable-data-type").value,
                        value: value,
                    };
                    let color = '#e60000';
                    if (this.variables[variableName].dataType == 'Number')
                        color = '#00ffff';
                    else if (this.variables[variableName].dataType == 'String')
                        color = '#aaff00';
                    let el = `<li id=${this.variables[variableName].dataType}-${variableName} class="list-group-item mt-2 ms-5 me-5 p-2 ps-3 rounded" style="font-size:15px; border: ${color} 2px solid; color: white; background: transparent;">${variableName}
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