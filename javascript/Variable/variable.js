import {colorMap} from '../ColorMap/colorMap.js'
import {ContextMenu } from '../ContextMenu/contextMenu.js'
class VariableList {

    constructor()
    {
        this.variables = [];
        this.variablesElements = [];
    }
    makeContextMenuItem(variable, setOrGet){
        let div = document.createElement("div");
        div.classList.toggle("context-menu-items", true);
        div.setAttribute('data-datatype', `${variable.dataType}`);
        // div.id=`${variable.dataType}-${variable.name}-${setOrGet}`;
        div.innerHTML = `${(setOrGet == 'set') ? 'Set': 'Get'} ${variable.name}`;
        return div;
    }
    addVariable(variable)
    {
        // this.variables[variableName] = {
        //     name: variableName,
        //     dataType: document.getElementById("variable-data-type").value,
        //     value: value,
        // };
        this.variables.push(variable);
        let el = this.makeLeftPanelVariableListItem(variable);
        //<button type="button" class="btn btn-outline-danger position-absolute end-0 me-1"">Delete</button>
        document.getElementById("variable-list").appendChild(el);
        // <div class="context-menu-items">GetRandom</div>
        // document.getElementById("context-menu").innerHTML += `<div class="context-menu-items" data-datatype=${variable.dataType} id="${variable.dataType}-${variable.name}-set">Set ${variable.name}</div>`;
        // document.getElementById("context-menu").innerHTML += `<div class="context-menu-items" data-datatype=${variable.dataType} id="${variable.dataType}-${variable.name}-get">Get ${variable.name}</div>`;
        let set = this.makeContextMenuItem(variable, 'set');
        let get = this.makeContextMenuItem(variable, 'get');
        // console.log(set, get);
        document.getElementById("context-menu").appendChild(get);
        document.getElementById("context-menu").appendChild(set);
        ContextMenu.addEventToCtxMenuItems(set);
        ContextMenu.addEventToCtxMenuItems(get);
        this.variablesElements.push(set);
        this.variablesElements.push(get)
    }
    makeLeftPanelVariableListItem(variable) {
        let li = document.createElement('li');
        li.id =  `${variable.dataType}-${variable.name}`;
        li.classList.toggle('list-group-item', true);
        li.classList.toggle('left-panel-variable', true);
        li.style.borderWidth = `0 0 0 2px`;
        li.style.borderStyle = 'solid';
        li.style.borderColor = `${colorMap[variable.dataType]}`;
        let text = document.createTextNode(`${variable.name}`);
        li.appendChild(text);
        return li;
        // return `<li id=${variable.dataType}-${variable.name} class="list-group-item mt-2 ms-5 me-5 p-2 ps-3 rounded" style="font-size:15px; border: ${colorMap[variable.dataType]} 2px solid; color: white; background: transparent;">${variable.name}
        //     </li>`;
    }

    deleteAllVariables()
    {
        this.variables = [];
        document.getElementById("variable-list").innerHTML = '';
        this.variablesElements.forEach((elem, index) => {
                elem.remove();
        })
    }
}

export var variableList = new VariableList();