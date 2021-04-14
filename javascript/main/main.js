import {AppStage} from '../AppStage/intiStage.js'
var width = window.innerWidth;
var height = window.innerHeight;
let stage = AppStage.getStage(width, height);
var layer = new Konva.Layer();
stage.add(layer);

for(let i=0; i<200; i++){
    let circle = new Konva.Circle({
        x: Math.floor(Math.random() * 10000),
        y: Math.floor(Math.random() * 10000),
        radius: Math.random() * 500,
        fill: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
    });
    layer.add(circle);
}
layer.draw();