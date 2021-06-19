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
    const starterFile = {"variables":[{"name":"f0","dataType":"Number","value":"0"},{"name":"f1","dataType":"Number","value":"1"},{"name":"tmp","dataType":"Number","value":"1"},{"name":"fibSeries","dataType":"Array","value":"[]"},{"name":"count","dataType":"Number","value":"1"}],"nodesData":[{"position":{"x":320.6845038762331,"y":261.9717696961985},"nodeDescription":{"nodeTitle":"Begin","execIn":false,"pinExecInId":null,"execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"388"}},"color":"Begin","rows":2,"colums":10}},{"position":{"x":523.4460891621779,"y":261.5443839042715},"nodeDescription":{"nodeTitle":"Set count","execIn":true,"pinExecInId":"214","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"215"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Number","defValue":"15","pinInId":"216"}},"outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"221"}},"color":"Func","rows":2,"colums":10}},{"position":{"x":725.2550000000002,"y":261.8949938964844},"nodeDescription":{"nodeTitle":"ForLoop","pinExecInId":"228","execIn":true,"execOut":{"execOut0":{"execOutTitle":"Loop Body","pinExecOutId":"229"},"execOut1":{"execOutTitle":"Completed","pinExecOutId":"231"}},"inputs":{"input0":{"inputTitle":"From","dataType":"Number","defValue":0,"pinInId":"233"},"input1":{"inputTitle":"To(Ex)","dataType":"Number","defValue":10,"pinInId":"238"},"input2":{"inputTitle":"Incr","dataType":"Number","defValue":1,"pinInId":"243"}},"outputs":{"output0":{"outputTitle":" Index","dataType":"Number","pinOutId":"248"}},"color":"Logic","rows":2,"colums":12}},{"position":{"x":1059.2631272328867,"y":58.59038009741202},"nodeDescription":{"nodeTitle":"PushBack","execIn":true,"pinExecInId":"255","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"256"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":1,"pinInId":"257"},"input1":{"inputTitle":"Array","dataType":"Array","isInputBoxRequired":false,"pinInId":"262"}},"outputs":{"output0":{"outputTitle":" Array","dataType":"Array","pinOutId":"264"}},"color":"Func","rows":2,"colums":10}},{"position":{"x":1070.423777275856,"y":258.6160632608399},"nodeDescription":{"nodeTitle":"Get f0","outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"271"}},"color":"Get","rows":2,"colums":10}},{"position":{"x":1073.836277275856,"y":344.97856326084},"nodeDescription":{"nodeTitle":"Get fibSeries","outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Array","pinOutId":"278"}},"color":"Get","rows":2,"colums":10}},{"position":{"x":1383.6033300958984,"y":56.35066756594574},"nodeDescription":{"nodeTitle":"Set tmp","execIn":true,"pinExecInId":"360","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"361"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Number","defValue":0,"pinInId":"362"}},"outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"367"}},"color":"Func","rows":2,"colums":10}},{"position":{"x":1971.955547315547,"y":49.80277783213775},"nodeDescription":{"nodeTitle":"Set f1","execIn":true,"pinExecInId":"374","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"375"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Number","defValue":0,"pinInId":"376"}},"outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"381"}},"color":"Func","rows":2,"colums":10}},{"position":{"x":1693.8807952440627,"y":162.1617401994804},"nodeDescription":{"nodeTitle":"Set f0","execIn":true,"pinExecInId":"329","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"330"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Number","defValue":0,"pinInId":"331"}},"outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"336"}},"color":"Func","rows":2,"colums":10}},{"position":{"x":1388.626406900547,"y":199.07472806913012},"nodeDescription":{"nodeTitle":"Add","inputs":{"input0":{"inputTitle":"ValueA","dataType":"Number","defValue":0,"pinInId":"343"},"input1":{"inputTitle":"ValueB","dataType":"Number","defValue":0,"pinInId":"348"}},"outputs":{"output0":{"outputTitle":" Result","dataType":"Number","pinOutId":"353"}},"color":"Math","rows":2,"colums":10}},{"position":{"x":1392.884962728789,"y":353.919400909754},"nodeDescription":{"nodeTitle":"Get f1","outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"322"}},"color":"Get","rows":2,"colums":10}},{"position":{"x":1583.3049114381276,"y":498.16030801230124},"nodeDescription":{"nodeTitle":"Print","execIn":true,"pinExecInId":"310","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"311"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":"'hello'","pinInId":"312"}},"color":"Func","rows":3,"colums":12}},{"position":{"x":1260.753560961127,"y":498.93399104140565},"nodeDescription":{"nodeTitle":"ForEachLoop","pinExecInId":"292","execIn":true,"execOut":{"execOut0":{"execOutTitle":"Loop Body","pinExecOutId":"293"},"execOut1":{"execOutTitle":"Completed","pinExecOutId":"295"}},"inputs":{"input0":{"inputTitle":"Array","dataType":"Array","isInputBoxRequired":false,"pinInId":"297"}},"outputs":{"output0":{"outputTitle":"Ref/Value","dataType":"Data","pinOutId":"299"},"output1":{"outputTitle":" Index","dataType":"Number","pinOutId":"301"},"output2":{"outputTitle":" Array","dataType":"Array","pinOutId":"303"}},"color":"Logic","rows":2,"colums":12}},{"position":{"x":1061.8509563883242,"y":667.3852355536546},"nodeDescription":{"nodeTitle":"Get fibSeries","outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Array","pinOutId":"285"}},"color":"Get","rows":2,"colums":10}},{"position":{"x":1001.1605922995557,"y":497.9447508326608},"nodeDescription":{"nodeTitle":"Print","execIn":true,"pinExecInId":"208","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"209"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":"'Fibonacci Series:'","pinInId":"210"}},"color":"Print","rows":3,"colums":12}}],"wireData":[{"srcId":"322","destId":"348"},{"srcId":"322","destId":"331"},{"srcId":"353","destId":"362"},{"srcId":"271","destId":"343"},{"srcId":"388","destId":"214"},{"srcId":"215","destId":"228"},{"srcId":"229","destId":"255"},{"srcId":"271","destId":"257"},{"srcId":"278","destId":"262"},{"srcId":"256","destId":"360"},{"srcId":"367","destId":"376"},{"srcId":"361","destId":"329"},{"srcId":"330","destId":"374"},{"srcId":"221","destId":"238"},{"srcId":"293","destId":"310"},{"srcId":"299","destId":"312"},{"srcId":"285","destId":"297"},{"srcId":"231","destId":"208"},{"srcId":"209","destId":"292"}]};
    let starterJSON = JSON.stringify(starterFile);
    new Import(stage, stage.findOne("#main_layer"), stage.findOne("#wireLayer"), starterJSON);
}

