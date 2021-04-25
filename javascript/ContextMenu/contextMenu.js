import { setLocationOfNode } from '../setLocationOfNode/setLocationOfNode.js'
import { Nodes } from '../Nodes/nodes.js'
export var ContextMenu = {
    contextMenu: function (stage, layer) {
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
        let alreadyPresent = [];
        stage.on('contextmenu', function (e) {
            e.evt.preventDefault();
            if (e.target === stage)
                toggleContextMenu([e.evt.clientX, e.evt.clientY], true);
            for (let e of contextMenu.children) {
                if (!alreadyPresent.find(value => value == e)) {
                    e.addEventListener('click', function () {
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
                        Nodes.CreateNode(e.innerHTML, { x: xx, y: yy }, layer, stage, isGetSet, dataType);
                        // setLocationOfNode.place(node, { x: xx, y: yy }, stage);
                        // layer.add(node);
                        layer.draw();
                        toggleContextMenu([], false);
                    })
                    alreadyPresent.push(e);
                };
            }
        });
        stage.on('click', function (e) {
            toggleContextMenu([e.evt.clientX, e.evt.clientY], false);
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