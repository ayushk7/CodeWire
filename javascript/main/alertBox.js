import { refresh } from '../SaveAndLoad/SaveAndLoad.js'
import { Import } from '../SaveAndLoad/SaveAndLoad.js'

export function showAlert(msg) {
    let alertMsg = document.getElementById("alert-box").children[0].children[0];
    let alertBox = document.getElementById("alert-box");
    document.getElementById("alert-ok-btn").addEventListener("click", (e) => {
        alertBox.classList.toggle("hidden", true);
        // console.log("ok clicked");
    });
    alertMsg.innerHTML = `<span style="color: tomato;">Alert:</span> ${msg}`;
    alertBox.classList.toggle('hidden', false);
    [...document.getElementsByClassName("sidebox")].forEach(value => {
        if (value !== alertBox) {
            value.classList.toggle("hidden", true);
        }
        else {
            value.classList.toggle("hidden", false);
        }
    })
}

// <div style="font-size: 1.2rem; color: white; padding: 10px; margin-top: 10px; text-align: center"><span
//                     style="color: tomato;">Alert:</span> Current Scipt Will Be Lost Unless Exported</div>

export function prompRefreshOrStarter(type, stage) {
    let refreshBox = document.getElementById("refresh-box");
    let refBtn = document.getElementById("refresh-btn");
    let refCnclBtn = document.getElementById("refresh-cancel-btn");
    // console.log("refresh clicked");
    if (type == 'refresh') {
        refreshBox.children[0].children[1].innerHTML = 'Refresh'
        refreshBox.classList.toggle('hidden', false);
        [...document.getElementsByClassName("sidebox")].forEach(value => {
            if (value !== refreshBox) {
                value.classList.toggle("hidden", true);
            }
            else {
                value.classList.toggle("hidden", false);
            }
        });
        refBtn.addEventListener("click", (e) => {
            refresh(stage.findOne("#main_layer"), stage.findOne("#wireLayer"));
            refreshBox.classList.toggle('hidden', true);
        });
        refCnclBtn.addEventListener("click", (e) => {
            refreshBox.classList.toggle('hidden', true);
        });
    }
    if (type == 'starter') {
        refreshBox.children[0].children[1].innerHTML = 'Load';
        refreshBox.classList.toggle('hidden', false);
        [...document.getElementsByClassName("sidebox")].forEach(value => {
            if (value !== refreshBox) {
                value.classList.toggle("hidden", true);
            }
            else {
                value.classList.toggle("hidden", false);
            }
        });
        refBtn.addEventListener("click", (e) => {
            refreshBox.classList.toggle('hidden', true);
            vscriptOnLoad(stage);
        });
        refCnclBtn.addEventListener("click", (e) => {
            refreshBox.classList.toggle('hidden', true);
        });
    }
}
export function vscriptOnLoad(stage) {
    // stage.setScale({x: 0.5, y: 0.5});
    const starterFile = { "variables": [{ "name": "coolStuff", "dataType": "String", "value": "'https://youtu.be/vTIIMJ9tUc8?t=105'" }], "nodesData": [{ "position": { "x": 285.76949478124993, "y": 160.00829895214838 }, "nodeDescription": { "nodeTitle": "Begin", "execIn": false, "pinExecInId": null, "execOut": { "execOut0": { "execOutTitle": null, "pinExecOutId": "10", "outOrder": 0 } }, "color": "Begin", "rows": 2, "colums": 10 } }, { "position": { "x": 501.3872296698097, "y": 161.2761797590843 }, "nodeDescription": { "nodeTitle": "Confirm", "execIn": true, "pinExecInId": "62", "execOut": { "execOut0": { "execOutTitle": null, "pinExecOutId": "63", "outOrder": 0 } }, "inputs": { "input0": { "inputTitle": "Message", "dataType": "String", "defValue": "'u wanna see some cool stuff ?'", "pinInId": "64" } }, "outputs": { "output0": { "outputTitle": "Ok?", "dataType": "Boolean", "pinOutId": "69", "outOrder": 1 } }, "color": "Print", "rows": 3, "colums": 12 } }, { "position": { "x": 1216.4116108593755, "y": 150.01528070898422 }, "nodeDescription": { "nodeTitle": "OpenWindow", "execIn": true, "pinExecInId": "16", "execOut": { "execOut0": { "execOutTitle": null, "pinExecOutId": "17", "outOrder": 0 } }, "inputs": { "input0": { "inputTitle": "URL", "dataType": "String", "defValue": "'link'", "pinInId": "18" } }, "outputs": { "output0": { "outputTitle": "Success?", "dataType": "Boolean", "pinOutId": "23", "outOrder": 1 } }, "color": "Func", "rows": 2, "colums": 12 } }, { "position": { "x": 1203.519704023151, "y": 382.23448287513907 }, "nodeDescription": { "nodeTitle": "Alert", "execIn": true, "pinExecInId": "101", "execOut": { "execOut0": { "execOutTitle": null, "pinExecOutId": "102", "outOrder": 0 } }, "inputs": { "input0": { "inputTitle": "Value", "dataType": "Data", "defValue": "'u missed some nice stuff'", "pinInId": "103" } }, "color": "Print", "rows": 3, "colums": 12 } }, { "position": { "x": 1202.448197106272, "y": 520.6776970135538 }, "nodeDescription": { "nodeTitle": "Alert", "execIn": true, "pinExecInId": "115", "execOut": { "execOut0": { "execOutTitle": null, "pinExecOutId": "116", "outOrder": 0 } }, "inputs": { "input0": { "inputTitle": "Value", "dataType": "Data", "defValue": "'After closing this dialog, right click on the editor to get bunch of new nodes and create your own scripts :)'", "pinInId": "117" } }, "color": "Print", "rows": 3, "colums": 12 } }, { "position": { "x": 773.9416135561129, "y": 211.52728595257065 }, "nodeDescription": { "nodeTitle": "If/Else", "execIn": true, "pinExecInId": "78", "execOut": { "execOut0": { "execOutTitle": "True", "pinExecOutId": "79", "outOrder": 0 }, "execOut1": { "execOutTitle": "False", "pinExecOutId": "81", "outOrder": 1 }, "execOut2": { "execOutTitle": "Done", "pinExecOutId": "83", "outOrder": 2 } }, "inputs": { "input0": { "inputTitle": "Bool", "dataType": "Boolean", "defValue": true, "pinInId": "85" } }, "color": "Logic", "rows": 3, "colums": 12 } }, { "position": { "x": 1162.8208273281257, "y": 280.7125038125001 }, "nodeDescription": { "nodeTitle": "Get coolStuff", "outputs": { "output0": { "outputTitle": "Value(Ref)", "dataType": "String", "pinOutId": "32", "outOrder": 0 } }, "color": "Get", "rows": 2, "colums": 10 } }], "wireData": [{ "srcId": "10", "destId": "62" }, { "srcId": "63", "destId": "78" }, { "srcId": "79", "destId": "16" }, { "srcId": "81", "destId": "101" }, { "srcId": "83", "destId": "115" }, { "srcId": "69", "destId": "85" }, { "srcId": "32", "destId": "18" }] };
    let starterJSON = JSON.stringify(starterFile);
    new Import(stage, stage.findOne("#main_layer"), stage.findOne("#wireLayer"), starterJSON);
}

