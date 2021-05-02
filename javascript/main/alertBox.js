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
    let starterJSON = JSON.stringify({"variables":[{"name":"randomArray","dataType":"Array","value":"[]"},{"name":"size","dataType":"Number","value":"0"},{"name":"smallest","dataType":"Number","value":"1e9"}],"nodesData":[{"position":{"x":586,"y":328.3999938964844},"nodeDescription":{"nodeTitle":"Set size","execIn":true,"pinExecInId":"30","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"31"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Number","defValue":"15","pinInId":"32"}},"outputs":{"output0":{"outputTitle":" Value","dataType":"Number","pinOutId":"37"}},"rows":2,"colums":10}},{"position":{"x":1370.1631939615258,"y":940.905199917655},"nodeDescription":{"nodeTitle":"Get randomArray","outputs":{"output0":{"outputTitle":" Value","dataType":"Array","pinOutId":"287"}},"rows":2,"colums":10}},{"position":{"x":327.8555268661128,"y":328.1535318389291},"nodeDescription":{"nodeTitle":"Begin","execIn":false,"pinExecInId":null,"execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"10"}},"rows":2,"colums":10}},{"position":{"x":812.6288946267774,"y":326.3489918052558},"nodeDescription":{"nodeTitle":"For","pinExecInId":"46","execIn":true,"execOut":{"execOut0":{"execOutTitle":"Loop Body","pinExecOutId":"47"},"execOut1":{"execOutTitle":"Completed","pinExecOutId":"49"}},"inputs":{"input0":{"inputTitle":"From","dataType":"Number","defValue":0,"pinInId":"51"},"input1":{"inputTitle":"To(Ex)","dataType":"Number","defValue":10,"pinInId":"56"},"input2":{"inputTitle":"Incr","dataType":"Number","defValue":1,"pinInId":"61"}},"outputs":{"output0":{"outputTitle":" Index","dataType":"Number","pinOutId":"66"}},"rows":2,"colums":12}},{"position":{"x":1127.961199324653,"y":36.53696607569413},"nodeDescription":{"nodeTitle":"PushBack","execIn":true,"pinExecInId":"77","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"78"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":1,"pinInId":"79"},"input1":{"inputTitle":"Array","dataType":"Array","isInputBoxRequired":false,"pinInId":"84"}},"outputs":{"output0":{"outputTitle":" Array","dataType":"Array","pinOutId":"86"}},"rows":2,"colums":10}},{"position":{"x":1138.1887715268529,"y":208.64800368047196},"nodeDescription":{"nodeTitle":"Floor","inputs":{"input0":{"inputTitle":"ValueA","dataType":"Number","defValue":1,"pinInId":"119"}},"outputs":{"output0":{"outputTitle":" Result","dataType":"Number","pinOutId":"124"}},"rows":2,"colums":10}},{"position":{"x":1146.4353961152342,"y":292.2310895552516},"nodeDescription":{"nodeTitle":"Multiply","inputs":{"input0":{"inputTitle":"ValueA","dataType":"Number","defValue":"100","pinInId":"100"},"input1":{"inputTitle":"ValueB","dataType":"Number","defValue":1,"pinInId":"105"}},"outputs":{"output0":{"outputTitle":" Result","dataType":"Number","pinOutId":"110"}},"rows":2,"colums":10}},{"position":{"x":1141.8395201016058,"y":426.7390182714839},"nodeDescription":{"nodeTitle":"Random","outputs":{"output0":{"outputTitle":" Rand","dataType":"Number","pinOutId":"93"}},"rows":2,"colums":10}},{"position":{"x":858.7266177536139,"y":114.84531547363345},"nodeDescription":{"nodeTitle":"Get randomArray","outputs":{"output0":{"outputTitle":" Value","dataType":"Array","pinOutId":"138"}},"rows":2,"colums":10}},{"position":{"x":1127.6082685153422,"y":519.1086525777432},"nodeDescription":{"nodeTitle":"Print","execIn":true,"pinExecInId":"147","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"148"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":"'Generated Array Is:'","pinInId":"149"}},"rows":3,"colums":12}},{"position":{"x":1135.5357289531244,"y":651.0435193946586},"nodeDescription":{"nodeTitle":"Print","execIn":true,"pinExecInId":"170","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"171"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":"'hello'","pinInId":"172"}},"rows":3,"colums":12}},{"position":{"x":1157.4577422307257,"y":788.3715569207814},"nodeDescription":{"nodeTitle":"Length","inputs":{"input0":{"inputTitle":"Array","dataType":"Array","isInputBoxRequired":false,"pinInId":"215"}},"outputs":{"output0":{"outputTitle":" Value","dataType":"Number","pinOutId":"217"}},"rows":2,"colums":10}},{"position":{"x":934.3569194888988,"y":791.9674248024418},"nodeDescription":{"nodeTitle":"Get randomArray","outputs":{"output0":{"outputTitle":" Value","dataType":"Array","pinOutId":"161"}},"rows":2,"colums":10}},{"position":{"x":1343.0112883051152,"y":665.4195322144561},"nodeDescription":{"nodeTitle":"For","pinExecInId":"186","execIn":true,"execOut":{"execOut0":{"execOutTitle":"Loop Body","pinExecOutId":"187"},"execOut1":{"execOutTitle":"Completed","pinExecOutId":"189"}},"inputs":{"input0":{"inputTitle":"From","dataType":"Number","defValue":0,"pinInId":"191"},"input1":{"inputTitle":"To(Ex)","dataType":"Number","defValue":10,"pinInId":"196"},"input2":{"inputTitle":"Incr","dataType":"Number","defValue":1,"pinInId":"201"}},"outputs":{"output0":{"outputTitle":" Index","dataType":"Number","pinOutId":"206"}},"rows":2,"colums":12}},{"position":{"x":1713.048778778092,"y":746.3906793104286},"nodeDescription":{"nodeTitle":"GetByPos","inputs":{"input0":{"inputTitle":"Pos","dataType":"Number","defValue":0,"pinInId":"271"},"input1":{"inputTitle":"Array","dataType":"Array","isInputBoxRequired":false,"pinInId":"276"}},"outputs":{"output0":{"outputTitle":" Value","dataType":"Data","pinOutId":"278"}},"rows":2,"colums":10}},{"position":{"x":1964.6164849184854,"y":525.4183600370415},"nodeDescription":{"nodeTitle":"Branch","execIn":true,"pinExecInId":"228","execOut":{"execOut0":{"execOutTitle":"       True","pinExecOutId":"229"},"execOut1":{"execOutTitle":"       False","pinExecOutId":"231"}},"inputs":{"input0":{"inputTitle":"Bool","dataType":"Boolean","defValue":true,"pinInId":"233"}},"rows":3,"colums":12}},{"position":{"x":2399.360699997034,"y":706.8162075980157},"nodeDescription":{"nodeTitle":"Set smallest","execIn":true,"pinExecInId":"300","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"301"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Number","defValue":0,"pinInId":"302"}},"outputs":{"output0":{"outputTitle":" Value","dataType":"Number","pinOutId":"307"}},"rows":2,"colums":10}},{"position":{"x":2097.956745583446,"y":747.3032061531559},"nodeDescription":{"nodeTitle":"Less","inputs":{"input0":{"inputTitle":"ValueA","dataType":"Number","defValue":0,"pinInId":"252"},"input1":{"inputTitle":"ValueB","dataType":"Number","defValue":1,"pinInId":"257"}},"outputs":{"output0":{"outputTitle":" Result","dataType":"Boolean","pinOutId":"262"}},"rows":2,"colums":10}},{"position":{"x":2120.053424210034,"y":975.8485746435755},"nodeDescription":{"nodeTitle":"Print","execIn":true,"pinExecInId":"332","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"333"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":"'hello'","pinInId":"334"}},"rows":3,"colums":12}},{"position":{"x":1756.7227092100336,"y":978.5998227427975},"nodeDescription":{"nodeTitle":"Print","execIn":true,"pinExecInId":"318","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"319"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":"'smallest:'","pinInId":"320"}},"rows":3,"colums":12}},{"position":{"x":1848.332301048118,"y":877.2551103494469},"nodeDescription":{"nodeTitle":"Get smallest","outputs":{"output0":{"outputTitle":" Value","dataType":"Number","pinOutId":"245"}},"rows":2,"colums":10}}],"wireData":[{"srcId":"10","destId":"30"},{"srcId":"31","destId":"46"},{"srcId":"37","destId":"56"},{"srcId":"47","destId":"77"},{"srcId":"124","destId":"79"},{"srcId":"110","destId":"119"},{"srcId":"93","destId":"105"},{"srcId":"138","destId":"84"},{"srcId":"49","destId":"147"},{"srcId":"148","destId":"170"},{"srcId":"161","destId":"215"},{"srcId":"161","destId":"172"},{"srcId":"171","destId":"186"},{"srcId":"217","destId":"196"},{"srcId":"206","destId":"271"},{"srcId":"287","destId":"276"},{"srcId":"187","destId":"228"},{"srcId":"229","destId":"300"},{"srcId":"278","destId":"302"},{"srcId":"278","destId":"252"},{"srcId":"262","destId":"233"},{"srcId":"189","destId":"318"},{"srcId":"319","destId":"332"},{"srcId":"245","destId":"334"},{"srcId":"245","destId":"257"}]})
    new Import(stage, stage.findOne("#main_layer"), stage.findOne("#wireLayer"), starterJSON);
}

