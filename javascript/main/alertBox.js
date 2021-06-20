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
    const starterFile = {"variables":[{"name":"f0","dataType":"Number","value":"0"},{"name":"f1","dataType":"Number","value":"1"},{"name":"tmp","dataType":"Number","value":"0"},{"name":"fibSeries","dataType":"Array","value":"[]"},{"name":"arraySize","dataType":"Number","value":"0"}],"nodesData":[{"position":{"x":288,"y":315.3999938964844},"nodeDescription":{"nodeTitle":"Begin","execIn":false,"pinExecInId":null,"execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"10","outOrder":0}},"color":"Begin","rows":2,"colums":10}},{"position":{"x":502,"y":316.3999938964844},"nodeDescription":{"nodeTitle":"Set arraySize","execIn":true,"pinExecInId":"16","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"17","outOrder":0}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Number","defValue":"15","pinInId":"18"}},"outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"23","outOrder":1}},"color":"Func","rows":2,"colums":10}},{"position":{"x":1005.0145989941013,"y":77.52018738011714},"nodeDescription":{"nodeTitle":"PushBack","execIn":true,"pinExecInId":"64","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"65","outOrder":0}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":1,"pinInId":"66"},"input1":{"inputTitle":"Array","dataType":"Array","isInputBoxRequired":false,"pinInId":"71"}},"outputs":{"output0":{"outputTitle":"Array","dataType":"Array","pinOutId":"73","outOrder":1}},"color":"Func","rows":2,"colums":10}},{"position":{"x":1006.5822326627344,"y":259.84704833437485},"nodeDescription":{"nodeTitle":"Get f0","outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"94","outOrder":0}},"color":"Get","rows":2,"colums":10}},{"position":{"x":1939.2851248191932,"y":76.71174058841183},"nodeDescription":{"nodeTitle":"Set f1","execIn":true,"pinExecInId":"197","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"198","outOrder":0}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Number","defValue":0,"pinInId":"199"}},"outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"204","outOrder":1}},"color":"Func","rows":2,"colums":10}},{"position":{"x":1332.6412802810553,"y":410.48379902978724},"nodeDescription":{"nodeTitle":"Get f1","outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"140","outOrder":0}},"color":"Get","rows":2,"colums":10}},{"position":{"x":1331.8554159788775,"y":77.18876733403076},"nodeDescription":{"nodeTitle":"Set tmp","execIn":true,"pinExecInId":"103","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"104","outOrder":0}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Number","defValue":0,"pinInId":"105"}},"outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"110","outOrder":1}},"color":"Func","rows":2,"colums":10}},{"position":{"x":1343.3887362869507,"y":252.85918921936945},"nodeDescription":{"nodeTitle":"Add","inputs":{"input0":{"inputTitle":"ValueA","dataType":"Number","defValue":0,"pinInId":"119"},"input1":{"inputTitle":"ValueB","dataType":"Number","defValue":0,"pinInId":"124"}},"outputs":{"output0":{"outputTitle":"Result","dataType":"Number","pinOutId":"129","outOrder":0}},"color":"Math","rows":2,"colums":10}},{"position":{"x":724.3499999999999,"y":318.3999938964844},"nodeDescription":{"nodeTitle":"ForLoop","pinExecInId":"32","execIn":true,"execOut":{"execOut0":{"execOutTitle":"Loop Body","pinExecOutId":"33","outOrder":0},"execOut1":{"execOutTitle":"Completed","pinExecOutId":"35","outOrder":2}},"inputs":{"input0":{"inputTitle":"From","dataType":"Number","defValue":0,"pinInId":"37"},"input1":{"inputTitle":"To(Excl)","dataType":"Number","defValue":10,"pinInId":"42"},"input2":{"inputTitle":"Increment","dataType":"Number","defValue":1,"pinInId":"47"}},"outputs":{"output0":{"outputTitle":"Index","dataType":"Number","pinOutId":"52","outOrder":1}},"color":"Logic","rows":2,"colums":12}},{"position":{"x":1001.3988143069367,"y":565.4126776885037},"nodeDescription":{"nodeTitle":"Print","execIn":true,"pinExecInId":"221","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"222","outOrder":0}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":"'Fibonacci Series:'","pinInId":"223"}},"color":"Print","rows":3,"colums":12}},{"position":{"x":1245.1125520830249,"y":563.7316162220931},"nodeDescription":{"nodeTitle":"ForEachLoop","pinExecInId":"235","execIn":true,"execOut":{"execOut0":{"execOutTitle":"Loop Body","pinExecOutId":"236","outOrder":0},"execOut1":{"execOutTitle":"Completed","pinExecOutId":"238","outOrder":4}},"inputs":{"input0":{"inputTitle":"Array","dataType":"Array","isInputBoxRequired":false,"pinInId":"240"}},"outputs":{"output0":{"outputTitle":"Ref/Value","dataType":"Data","pinOutId":"242","outOrder":1},"output1":{"outputTitle":"Index","dataType":"Number","pinOutId":"244","outOrder":2},"output2":{"outputTitle":"Array","dataType":"Array","pinOutId":"246","outOrder":3}},"color":"Logic","rows":2,"colums":12}},{"position":{"x":1014.4451528567733,"y":698.8282897562424},"nodeDescription":{"nodeTitle":"Get fibSeries","outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Array","pinOutId":"255","outOrder":0}},"color":"Get","rows":2,"colums":10}},{"position":{"x":1501.5656830621049,"y":564.223651141948},"nodeDescription":{"nodeTitle":"Print","execIn":true,"pinExecInId":"264","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"265","outOrder":0}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":"'hello'","pinInId":"266"}},"color":"Print","rows":3,"colums":12}},{"position":{"x":1667.3934112025051,"y":167.17469860202857},"nodeDescription":{"nodeTitle":"Set f0","execIn":true,"pinExecInId":"165","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"166","outOrder":0}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Number","defValue":0,"pinInId":"167"}},"outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Number","pinOutId":"172","outOrder":1}},"color":"Func","rows":2,"colums":10}},{"position":{"x":1005.5926336686327,"y":356.1769146657424},"nodeDescription":{"nodeTitle":"Get fibSeries","outputs":{"output0":{"outputTitle":"Ref/Val","dataType":"Array","pinOutId":"85","outOrder":0}},"color":"Get","rows":2,"colums":10}}],"wireData":[{"srcId":"10","destId":"16"},{"srcId":"94","destId":"66"},{"srcId":"65","destId":"103"},{"srcId":"110","destId":"199"},{"srcId":"94","destId":"119"},{"srcId":"140","destId":"124"},{"srcId":"129","destId":"105"},{"srcId":"17","destId":"32"},{"srcId":"33","destId":"64"},{"srcId":"23","destId":"42"},{"srcId":"35","destId":"221"},{"srcId":"222","destId":"235"},{"srcId":"255","destId":"240"},{"srcId":"236","destId":"264"},{"srcId":"242","destId":"266"},{"srcId":"104","destId":"165"},{"srcId":"166","destId":"197"},{"srcId":"140","destId":"167"},{"srcId":"85","destId":"71"}]};
    let starterJSON = JSON.stringify(starterFile);
    new Import(stage, stage.findOne("#main_layer"), stage.findOne("#wireLayer"), starterJSON);
}

