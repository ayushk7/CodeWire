import { AppStage } from '../AppStage/intiStage.js'
import {setLocationOfNode} from '../setLocationOfNode/setLocationOfNode.js'
var width = window.innerWidth;
var height = window.innerHeight;
let stage = AppStage.getStage(width, height, 'container');
var layer = new Konva.Layer();
stage.add(layer);

let contextMenu = document.getElementById("context-menu");
function toggleContextMenu(location, show) {
    if (show) {
        contextMenu.style.display = 'block';
        contextMenu.style.left = location[0] + 'px';
        contextMenu.style.top = location[1] + 'px';
    }
    else {
        contextMenu.style.display = 'none';
    }
}
stage.on('contextmenu', function (e) {
    e.evt.preventDefault();
    if (e.target === stage)
        toggleContextMenu([e.evt.clientX, e.evt.clientY], true);
})
stage.on('click', function (e) {
    toggleContextMenu([e.evt.clientX, e.evt.clientY], false);
});

let getNode = function () {
    let theNode = new Konva.Group();
    let rect = new Konva.Rect({
        height: 50,
        width: 100,
        cornerRadius: 10,
        fill: 'grey'
    });
    theNode.add(rect);
    theNode.draggable(true);
    return theNode;
}



for (let e of contextMenu.children) {
    e.addEventListener('click', function () {
        // console.log(e);
        if ("Tick" == e.innerHTML) {
            let xx = e.parentElement.getBoundingClientRect().x;
            let yy = e.parentElement.getBoundingClientRect().y; 
            let el = getNode();
            setLocationOfNode.place(el, {x: xx, y: yy}, stage);
            layer.add(el);
            layer.draw();
        }
        else {
            // console.log("no");
        }
        toggleContextMenu([], false);
    });
}
let circle = new Konva.Circle({
    x: 200,
    y: 200,
    radius: 50,
    fill: 'red',
    draggable: true
});
layer.add(circle);


layer.draw();