import { AppStage } from '../AppStage/intiStage.js'
// import {SelectionBox} from '../SelectionBox/SelectionBox.js'
import { DragAndDrop } from '../DragAndDrop/DragAndDrop.js'
import { Wiring } from '../Wiring/Wiring.js'
import { ContextMenu } from '../ContextMenu/contextMenu.js'
import { leftPanel } from '../LeftPanel/LeftPanel.js'
import { VSToJS } from '../VSToJS/VStoJS.js'
var width = window.innerWidth;
var height = window.innerHeight;
let stage = AppStage.getStage(document.getElementById("container").clientWidth, document.getElementById("container").clientHeight, 'container');
var layer = new Konva.Layer({
    id: 'main_layer'
});
stage.add(layer);
stage.container().style.backgroundPosition = `${stage.position().x} ${stage.position().y}`;

// stage.on("wheel", () => {
//     if (inputIsFocused) {
//         document.getElementById("number-ip").blur();
//         document.getElementById("string-ip").blur();
//         document.getElementById("bool-ip").blur();
//     }
// });
DragAndDrop.DragAndDrop(stage, layer);
Wiring.enableWiring(stage, layer);
ContextMenu.contextMenu(stage, layer);
let panel = new leftPanel();
// layer.toggleHitCanvas();
// document.getElementById("number-ip").value = 12;
layer.draw();
document.getElementById("run").addEventListener("click", (e) => {
    console.log('variables:', panel.variables);
    new VSToJS(stage, layer, panel.variables);
})

