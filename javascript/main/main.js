import { AppStage } from '../AppStage/intiStage.js'
// import {SelectionBox} from '../SelectionBox/SelectionBox.js'
import { DragAndDrop } from '../DragAndDrop/DragAndDrop.js'
import { Wiring } from '../Wiring/Wiring.js'
import { Nodes } from '../Nodes/nodes.js'
import {ContextMenu} from '../ContextMenu/contextMenu.js'
var width = window.innerWidth;
var height = window.innerHeight;
let stage = AppStage.getStage(width, height, 'container');
var layer = new Konva.Layer({
    id: 'main_layer'
});
stage.add(layer);
stage.container().style.backgroundPosition = `${stage.position().x} ${stage.position().y}`;

DragAndDrop.DragAndDrop(stage, layer);
Wiring.enableWiring(stage, layer);
ContextMenu.contextMenu(stage, layer);
// layer.toggleHitCanvas();
layer.draw();