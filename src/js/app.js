import './registry/index.js';
import { AppStage } from './core/stage.js'
// import { SelectionBox } from './editor/selectionBox.js'
import { DragAndDrop } from './editor/dragAndDrop.js'
import { Wiring } from './nodes/wiring.js'
import { ContextMenu } from './editor/contextMenu.js'
import { leftPanel } from './ui/variablePanel.js'
import { variableList } from './ui/variableList.js'
import { VSToJS } from './compiler/compiler.js'
import { Delete } from './editor/deleteHandler.js'
import { Export, Import, Save, prompLastSave } from './persistence/saveAndLoad.js'
import { showAlert, prompRefreshOrStarter } from './ui/dialogs.js'
import { refresh } from './compiler/codePreview.js'
import { enableNodeGroups } from './editor/nodeGroup.js'
// var width = window.innerWidth;
// var height = window.innerHeight;
let stage = AppStage.getStage(document.getElementById("container").clientWidth, document.getElementById("container").clientHeight, 'container');
var layer = new Konva.Layer({
    id: 'main_layer'
});
let dragLayer = new Konva.Layer({
    id: 'dragLayer',
});
stage.add(layer);
stage.add(dragLayer);
stage.container().style.backgroundPosition = `${stage.position().x} ${stage.position().y}`;

// stage.on("wheel", () => {
//     if (inputIsFocused) {
//         document.getElementById("number-ip").blur();
//         document.getElementById("string-ip").blur();
//         document.getElementById("bool-ip").blur();
//     }
// });
// SelectionBox.setSelectionBox(layer, stage);
enableNodeGroups(stage, layer);
Delete.enableDelete(stage, layer);
// DragAndDrop.DragAndDrop(stage, layer);
Wiring.enableWiring(stage, layer);
ContextMenu.contextMenu(stage, layer);
let panel = new leftPanel();
variableList.init(layer, stage);
// layer.toggleHitCanvas();
// document.getElementById("number-ip").value = 12;
layer.draw();
document.getElementById("Run").addEventListener("click", (e) => {
    try {
        let script = new VSToJS(stage, layer, "Run").script;
        // let script = new VSToJS(stage, layer, "live-code-refresh").script;
        refresh(script);
    }
    catch (err) {

    }
});
// stage.on('mouseup', () => {
//     console.log("x");
// })

new Save(stage, layer, stage.findOne('#wireLayer'));
new Export(stage, layer, stage.findOne('#wireLayer'));
// let script = `{"variables":[{"name":"sadsad","dataType":"Number","value":"0"},{"name":"sadsaddd","dataType":"Array","value":"[1,2]"}],"nodesData":[{"position":{"x":511,"y":16},"nodeDescription":{"nodeTitle":"Begin","execIn":false,"pinExecInId":null,"execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"10"}},"rows":2,"colums":10}},{"position":{"x":968,"y":98},"nodeDescription":{"nodeTitle":"Print","execIn":true,"pinExecInId":"16","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"17"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":"hello","pinInId":"18"}},"rows":3,"colums":12}},{"position":{"x":706,"y":89},"nodeDescription":{"nodeTitle":"Branch","execIn":true,"pinExecInId":"28","execOut":{"execOut0":{"execOutTitle":"       True","pinExecOutId":"29"},"execOut1":{"execOutTitle":"       False","pinExecOutId":"31"}},"inputs":{"input0":{"inputTitle":"Bool","dataType":"Boolean","defValue":true,"pinInId":"33"}},"rows":3,"colums":12}}],"wireData":[{"srcId":"31","destId":"16"},{"srcId":"29","destId":"16"},{"srcId":"10","destId":"28"}]}`;
// ── Import modal logic ──
const importOverlay  = document.getElementById("import-overlay");
const importModal    = document.getElementById("import-modal");
const importDropzone = document.getElementById("import-dropzone");
const importFileInput = document.getElementById("upload-json");
const importFileInfo = document.getElementById("import-file-info");
const importFilename = document.getElementById("import-filename");
const importFileClear = document.getElementById("import-file-clear");
const importCloseBtn = document.getElementById("import-close-btn");
const importCancelBtn = document.getElementById("import-cancel-btn");
const importBtn      = document.getElementById("import-btn");

function openImportModal() {
    [...document.getElementsByClassName("sidebox")].forEach(v => v.classList.add("hidden"));
    importFileInput.value = "";
    importFileInfo.classList.add("hidden");
    importFilename.textContent = "";
    importDropzone.classList.remove("drag-over");
    importOverlay.classList.remove("hidden");
}

function closeImportModal() {
    importOverlay.classList.add("hidden");
}

function showSelectedFile(file) {
    if (!file) return;
    importFilename.textContent = file.name;
    importFileInfo.classList.remove("hidden");
}

document.getElementById("import").addEventListener("click", openImportModal);

importOverlay.addEventListener("click", (e) => {
    if (e.target === importOverlay) closeImportModal();
});
importCloseBtn.addEventListener("click", closeImportModal);
importCancelBtn.addEventListener("click", closeImportModal);

importDropzone.addEventListener("click", () => importFileInput.click());

importDropzone.addEventListener("dragenter", (e) => { e.preventDefault(); importDropzone.classList.add("drag-over"); });
importDropzone.addEventListener("dragover",  (e) => { e.preventDefault(); importDropzone.classList.add("drag-over"); });
importDropzone.addEventListener("dragleave", ()  => { importDropzone.classList.remove("drag-over"); });
importDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    importDropzone.classList.remove("drag-over");
    const files = e.dataTransfer.files;
    if (files.length) {
        importFileInput.files = files;
        showSelectedFile(files[0]);
    }
});

importFileInput.addEventListener("change", () => {
    if (importFileInput.files.length) showSelectedFile(importFileInput.files[0]);
});

importFileClear.addEventListener("click", () => {
    importFileInput.value = "";
    importFileInfo.classList.add("hidden");
    importFilename.textContent = "";
});

importBtn.addEventListener("click", () => {
    const files = importFileInput.files;
    if (!files.length) {
        showAlert("Upload File First");
        return;
    }
    try {
        const fr = new FileReader();
        fr.onload = function (e) {
            new Import(stage, layer, stage.findOne('#wireLayer'), e.target.result);
            closeImportModal();
        };
        fr.readAsText(files[0]);
    } catch (err) {
        document.getElementById("console-window").classList.toggle("hidden", false);
        let codeDoc = document.getElementById("console").contentWindow.document;
        codeDoc.open();
        codeDoc.writeln(
            `<!DOCTYPE html>\n<style>html{color:white;margin:20;}</style>
            <body><code>"Error Occurred In Importing The JSON"<br>${err}</code></body></html>`
        );
        codeDoc.close();
    }
});
document.getElementById("live-code-refresh").addEventListener("click", () => {
    let script = new VSToJS(stage, layer, "live-code-refresh").script;
    refresh(script);
}
);
document.onkeydown = (e) => {
    // e.preventDefault();
    if (e.code == 'KeyQ' && e.ctrlKey) {
        let script = new VSToJS(stage, layer, "live-code-refresh").script;
        refresh(script);
    }
}
document.getElementById("live-code-arrow").addEventListener("click", () => {
    document.getElementById("live-code-container").classList.toggle("live-code-closed");
    document.getElementById("live-code-arrow").classList.toggle("live-code-arrow-clicked");
});
document.getElementById("Code").addEventListener("click", () => {
    document.getElementById("live-code-container").classList.toggle("live-code-closed");
    document.getElementById("live-code-refresh").click();
    document.getElementById("live-code-arrow").classList.toggle("live-code-arrow-clicked");
})
document.getElementById("Console").addEventListener("click", (e) => {
    document.getElementById("console-window").classList.toggle("hidden");
})
document.getElementById("cross-console").addEventListener("click", (e) => {
    document.getElementById("console-window").classList.toggle("hidden", true);
});
document.getElementById("reload").addEventListener("click", (e) => {
    prompLastSave(stage, layer, stage.findOne('#wireLayer'));
});

document.getElementById("refresh").addEventListener("click", (e) => {
    prompRefreshOrStarter("refresh", stage);
});
document.getElementById("starter").addEventListener("click", (e) => {
    prompRefreshOrStarter("starter", stage);
})



