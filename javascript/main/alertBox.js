import { refresh } from '../SaveAndLoad/SaveAndLoad.js'
import {Import} from '../SaveAndLoad/SaveAndLoad.js'

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
    if(type == 'starter'){
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
    let starterJSON = JSON.stringify({"variables":[{"name":"f0","dataType":"Number","value":"0"},{"name":"f1","dataType":"Number","value":"1"},{"name":"tmp","dataType":"Number","value":"1"},{"name":"fibSeries","dataType":"Array","value":"[]"},{"name":"count","dataType":"Number","value":"1"}],"nodesData":[{"position":{"x":1080.0360696077494,"y":82.85152691119445},"nodeDescription":{"nodeTitle":"PushBack","execIn":true,"pinExecInId":"63","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"64"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":1,"pinInId":"65"},"input1":{"inputTitle":"Array","dataType":"Array","isInputBoxRequired":false,"pinInId":"70"}},"outputs":{"output0":{"outputTitle":" Array","dataType":"Array","pinOutId":"72"}},"rows":2,"colums":10}},{"position":{"x":1603.7852925199077,"y":190.4595931990669},"nodeDescription":{"nodeTitle":"Set f0","execIn":true,"pinExecInId":"178","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"179"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Number","defValue":0,"pinInId":"180"}},"outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"185"}},"rows":2,"colums":10}},{"position":{"x":1360.8100830778587,"y":227.72827052769958},"nodeDescription":{"nodeTitle":"Add","inputs":{"input0":{"inputTitle":"ValueA","dataType":"Number","defValue":0,"pinInId":"115"},"input1":{"inputTitle":"ValueB","dataType":"Number","defValue":0,"pinInId":"120"}},"outputs":{"output0":{"outputTitle":" Result","dataType":"Number","pinOutId":"125"}},"rows":2,"colums":10}},{"position":{"x":1362.8916764686367,"y":81.1834502422683},"nodeDescription":{"nodeTitle":"Set tmp","execIn":true,"pinExecInId":"99","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"100"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Number","defValue":0,"pinInId":"101"}},"outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"106"}},"rows":2,"colums":10}},{"position":{"x":1362.8193363784287,"y":375.74993645609715},"nodeDescription":{"nodeTitle":"Get f1","outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"134"}},"rows":2,"colums":10}},{"position":{"x":734.7271639803766,"y":252.31470456099825},"nodeDescription":{"nodeTitle":"ForLoop","pinExecInId":"32","execIn":true,"execOut":{"execOut0":{"execOutTitle":"Loop Body","pinExecOutId":"33"},"execOut1":{"execOutTitle":"Completed","pinExecOutId":"35"}},"inputs":{"input0":{"inputTitle":"From","dataType":"Number","defValue":0,"pinInId":"37"},"input1":{"inputTitle":"To(Ex)","dataType":"Number","defValue":10,"pinInId":"42"},"input2":{"inputTitle":"Incr","dataType":"Number","defValue":1,"pinInId":"47"}},"outputs":{"output0":{"outputTitle":" Index","dataType":"Number","pinOutId":"52"}},"rows":2,"colums":12}},{"position":{"x":524.6313816595801,"y":255.65027536175393},"nodeDescription":{"nodeTitle":"Set count","execIn":true,"pinExecInId":"16","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"17"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Number","defValue":"15","pinInId":"18"}},"outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"23"}},"rows":2,"colums":10}},{"position":{"x":336.78966722414054,"y":253.74748035544116},"nodeDescription":{"nodeTitle":"Begin","execIn":false,"pinExecInId":null,"execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"10"}},"rows":2,"colums":10}},{"position":{"x":1914.476686279197,"y":75.18692169018078},"nodeDescription":{"nodeTitle":"Set f1","execIn":true,"pinExecInId":"238","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"239"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Number","defValue":0,"pinInId":"240"}},"outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"245"}},"rows":2,"colums":10}},{"position":{"x":1077.3864861959246,"y":272.33718102153455},"nodeDescription":{"nodeTitle":"Get f0","outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"90"}},"rows":2,"colums":10}},{"position":{"x":1365.101264117255,"y":466.7923594162747},"nodeDescription":{"nodeTitle":"Print","execIn":true,"pinExecInId":"222","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"223"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":"'hello'","pinInId":"224"}},"rows":3,"colums":12}},{"position":{"x":1059.184664284337,"y":451.42707240507633},"nodeDescription":{"nodeTitle":"ForEachLoop","pinExecInId":"200","execIn":true,"execOut":{"execOut0":{"execOutTitle":"Loop Body","pinExecOutId":"201"},"execOut1":{"execOutTitle":"Completed","pinExecOutId":"203"}},"inputs":{"input0":{"inputTitle":"Array","dataType":"Array","isInputBoxRequired":false,"pinInId":"205"}},"outputs":{"output0":{"outputTitle":"Ref/Value","dataType":"Data","pinOutId":"207"},"output1":{"outputTitle":" Index","dataType":"Number","pinOutId":"209"},"output2":{"outputTitle":" Array","dataType":"Array","pinOutId":"211"}},"rows":2,"colums":12}},{"position":{"x":1070.2830725494803,"y":357.8299673333744},"nodeDescription":{"nodeTitle":"Get fibSeries","outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Array","pinOutId":"1072"}},"rows":2,"colums":10}},{"position":{"x":850.5073874869801,"y":617.8085625110979},"nodeDescription":{"nodeTitle":"Get fibSeries","outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Array","pinOutId":"1081"}},"rows":2,"colums":10}}],"wireData":[{"srcId":"1081","destId":"205"},{"srcId":"207","destId":"224"},{"srcId":"201","destId":"222"},{"srcId":"35","destId":"200"},{"srcId":"64","destId":"99"},{"srcId":"100","destId":"178"},{"srcId":"125","destId":"101"},{"srcId":"134","destId":"120"},{"srcId":"134","destId":"180"},{"srcId":"33","destId":"63"},{"srcId":"17","destId":"32"},{"srcId":"23","destId":"42"},{"srcId":"10","destId":"16"},{"srcId":"179","destId":"238"},{"srcId":"106","destId":"240"},{"srcId":"90","destId":"65"},{"srcId":"90","destId":"115"},{"srcId":"1072","destId":"70"}]});
    new Import(stage, stage.findOne("#main_layer"), stage.findOne("#wireLayer"), starterJSON);
}

