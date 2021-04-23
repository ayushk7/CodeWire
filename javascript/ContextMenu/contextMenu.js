import { setLocationOfNode } from '../setLocationOfNode/setLocationOfNode.js'
import {Nodes} from '../Nodes/nodes.js'
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
        stage.on('contextmenu', function (e) {
            e.evt.preventDefault();
            if (e.target === stage)
                toggleContextMenu([e.evt.clientX, e.evt.clientY], true);
        });
        stage.on('click', function (e) {
            toggleContextMenu([e.evt.clientX, e.evt.clientY], false);
        });
        for (let e of contextMenu.children) {
            e.addEventListener('click', function () {
                let xx = e.parentElement.getBoundingClientRect().x;
                let yy = e.parentElement.getBoundingClientRect().y;
                let node = undefined;
                Nodes.CreateNode(e.innerHTML, {x: xx, y: yy}, layer, stage);
                // setLocationOfNode.place(node, { x: xx, y: yy }, stage);
                // layer.add(node);
                layer.draw();
                toggleContextMenu([], false);
            });
        }
    }
}