import { setLocationOfNode } from '../setLocationOfNode/setLocationOfNode.js'
import { Nodes } from '../Nodes/nodes.js'

export var ContextMenu = {
    contextMenu: function (stage, layer) {
        let contextMenu = document.getElementById("context-menu"); document.getElementById("context-menu")
        function toggleContextMenu(location, show) {
            if (show) {
                contextMenu.classList.toggle("hidden", false);
                contextMenu.style.left = location[0] + 'px';
                contextMenu.style.top = location[1] + 'px';
            }
            else {
                contextMenu.classList.toggle("hidden", true);
            }
        }
        ContextMenu.addEventToCtxMenyItems = function(e) {
            e.addEventListener('click', function () {
                makeNode(e, stage, layer, toggleContextMenu);
            });
        }

        for (let e of contextMenu.children) {
            this.addEventToCtxMenyItems(e);
        };

        // let alreadyPresent = [];   // to prevent adding multiple eventListeners
        stage.on('contextmenu', function (e) {
            e.evt.preventDefault();
            if (e.target === stage)
                toggleContextMenu([e.evt.clientX, e.evt.clientY], true);

        });
        stage.on('click', function (e) {
            toggleContextMenu([e.evt.clientX, e.evt.clientY], false);
        });
        document.addEventListener("click", (e) => {
            if (e.target !== stage.getContainer())
                toggleContextMenu([0, 0], false);
        });
        // for (let e of contextMenu.children) {
        //     e.addEventListener('click', function () {
        //         let xx = e.parentElement.getBoundingClientRect().x - stage.getContainer().getBoundingClientRect().x;
        //         let yy = e.parentElement.getBoundingClientRect().y - stage.getContainer().getBoundingClientRect().y;
        //         let node = undefined;
        //         // let dataType;
        //         // // console.log("x")
        //         // if(e.dataset.dataType)
        //         //     dataType = e.dataset.dataType;
        //         Nodes.CreateNode(e.innerHTML, { x: xx, y: yy }, layer, stage);
        //         // setLocationOfNode.place(node, { x: xx, y: yy }, stage);
        //         // layer.add(node);
        //         layer.draw();
        //         toggleContextMenu([], false);
        //     });
    }
}



function makeNode(e, stage, layer, toggleContextMenu) {
    let xx = e.parentElement.getBoundingClientRect().x - stage.getContainer().getBoundingClientRect().x;
    let yy = e.parentElement.getBoundingClientRect().y - stage.getContainer().getBoundingClientRect().y;
    let node = undefined;
    let dataType;
    if (e.dataset.datatype)
        dataType = e.dataset.datatype;
    let tmp = e.innerHTML.split(" ");
    let isGetSet = "";
    if (tmp[0] == "Get")
        isGetSet = "Get";
    else if (tmp[0] == "Set")
        isGetSet = "Set";
    let defValue = null;
    Nodes.CreateNode(e.innerHTML, { x: xx, y: yy }, layer, stage, isGetSet, dataType, defValue);
    // setLocationOfNode.place(node, { x: xx, y: yy }, stage);
    // layer.add(node);
    console.log("makeNode");
    layer.draw();
    toggleContextMenu([], false);
}
