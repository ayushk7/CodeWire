import { AppStage } from '../AppStage/intiStage.js'
// import {SelectionBox} from '../SelectionBox/SelectionBox.js'
import { DragAndDrop } from '../DragAndDrop/DragAndDrop.js'
import { Wiring } from '../Wiring/Wiring.js'
import { ContextMenu } from '../ContextMenu/contextMenu.js'
import { leftPanel } from '../LeftPanel/LeftPanel.js'
import { VSToJS } from '../VSToJS/VStoJS.js'
import { Delete } from '../Delete/delete.js'
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
Delete.enableDelete(stage, layer);
DragAndDrop.DragAndDrop(stage, layer);
Wiring.enableWiring(stage, layer);
ContextMenu.contextMenu(stage, layer);
let panel = new leftPanel();
// layer.toggleHitCanvas();
// document.getElementById("number-ip").value = 12;
layer.draw();
document.getElementById("Run").addEventListener("click", (e) => {
    new VSToJS(stage, layer, panel.variables, "Run");
})
document.getElementById("Code").addEventListener("click", () => {
    new VSToJS(stage, layer, panel.variables, "Code");

});
document.getElementById("Console").addEventListener("click", (e) => {
    document.getElementById("console-window").classList.toggle("hidden");
})
document.getElementById("cross").addEventListener("click", (e) => {
    document.getElementById("console-window").classList.toggle("hidden", true);
});
document.getElementById("Tutorial").addEventListener("click", (e) => {
    document.getElementById("console-window").classList.toggle("hidden", false);
    let codeDoc = document.getElementById("console").contentWindow.document;
    codeDoc.open();
    codeDoc.writeln(
        `<!DOCTYPE html>\n
                    <style>
                        html{
                            color: white;
                            margin: 20;
                        }
                    </style>
                    <body>
                    <code>
                    <ol>
                    <li>Include Begin Node By Right Click And Select Begin</li>
                    <li>Include Other In The Same Way</li>
                    <li>Use Left Panel To create New Variable</li>
                    <li>Hold middle mouse button To Pan</li>
                    <li>Use Scroll Wheel To Zoom in and out</li>
                    <li>Hold left Ctrl and click the node or the wire to delete it</li>
                    <li>Click Code to get Javascript native code</li>
                    </ol>
                    </code>
                    </body>
                    </html>
                    `
    );
    codeDoc.close();
}
);

