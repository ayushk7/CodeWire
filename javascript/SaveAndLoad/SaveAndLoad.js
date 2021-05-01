import { Nodes } from '../Nodes/nodes.js'
import { addConnectionWire } from '../Wiring/Wiring.js'
import { variableList } from '../Variable/variable.js'
function writeError(err, msg) {
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
                "${msg}"<br>
                ${err}
                </code>
                </body>
                </html>
                `
    );
    codeDoc.close();
}
let placeLocation = function (location) {
    //"this" is stage
    return {
        x: (location.x - this.x()) / this.scaleX(),
        y: (location.y - this.y()) / this.scaleY()
    };
}
export class Export {
    constructor(stage, layer, wireLayer) {
        document.getElementById('export').addEventListener("click", (e) => {
            let exportScript = [];
            let nodesData = [];
            let wireData = [];
            layer.find('.aProgramNodeGroup').forEach((node, index) => {
                if (node.name() == 'aProgramNodeGroup') {
                    let nodeData = {
                        position: node.position(),
                        nodeDescription: node.customClass.nodeDescription,
                    };
                    nodesData.push(nodeData);
                }
            });
            wireLayer.find('.isConnection').forEach((aWire, index) => {
                if (aWire.name() == 'isConnection') {
                    let wireD = {
                        srcId: aWire.attrs.src.id(),
                        destId: aWire.attrs.dest.id(),
                    }
                    wireData.push(wireD);
                }
            })
            exportScript = {
                variables: variableList.variables,
                nodesData: nodesData,
                wireData: wireData,
            }
            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportScript));
            let exportAnchorElem = document.getElementById('exportAnchorElem');
            exportAnchorElem.setAttribute("href", dataStr);
            exportAnchorElem.setAttribute("download", "wireScript.json");
            exportAnchorElem.click();

            // console.log(JSON.stringify(exportScript));
            // console.log(JSON.parse(JSON.stringify(exportScript)));
        });
    }
}
function refresh(layer, wireLayer) {
    layer.destroyChildren();
    wireLayer.destroyChildren();
    variableList.deleteAllVariables();
}

export class Import {
    constructor(stage, layer, wireLayer, script) {
        refresh(layer, wireLayer);
        let json = null;
        try {
            json = JSON.parse(script);
        }
        catch (err) {
            writeError(err, "Error In Loading JSON(JSON TEMPERED)");
        }
        // console.log(json);
        printContent(json, stage, layer, wireLayer);
    }
}
export class Save {
    constructor(stage, layer, wireLayer) {
        document.getElementById('save').addEventListener("click", (e) => {
            let exportScript = [];
            let nodesData = [];
            let wireData = [];
            layer.find('.aProgramNodeGroup').forEach((node, index) => {
                if (node.name() == 'aProgramNodeGroup') {
                    let nodeData = {
                        position: node.position(),
                        nodeDescription: node.customClass.nodeDescription,
                    };
                    nodesData.push(nodeData);
                }
            });
            wireLayer.find('.isConnection').forEach((aWire, index) => {
                if (aWire.name() == 'isConnection') {
                    let wireD = {
                        srcId: aWire.attrs.src.id(),
                        destId: aWire.attrs.dest.id(),
                    }
                    wireData.push(wireD);
                }
            })
            exportScript = {
                variables: variableList.variables,
                nodesData: nodesData,
                wireData: wireData,
            }
            localStorage.setItem('lastLoadWireScriptJSON', JSON.stringify(exportScript));
            document.getElementById("saving").classList.toggle("hidden", false);
            document.getElementById("import-menu").classList.toggle("hidden", true);
            document.getElementById("save-menu").classList.toggle("hidden", true);
            setTimeout(() => {
                document.getElementById("saving").classList.toggle("hidden", true);
            }, 300)

        });
        window.addEventListener("load", () => {
            // console.log("loaded");
            document.getElementById("saving").classList.toggle("hidden", true);
            document.getElementById("import-menu").classList.toggle("hidden", true);
            if (localStorage.getItem('lastLoadWireScriptJSON') && localStorage.getItem('lastLoadWireScriptJSON') != "{\"variables\":[],\"nodesData\":[],\"wireData\":[]}") {
                document.getElementById("save-menu").classList.toggle("hidden", false);
                document.getElementById("load-btn").onclick = function(){
                    new Import(stage, layer, wireLayer, localStorage.getItem('lastLoadWireScriptJSON'));
                    document.getElementById("save-menu").classList.toggle("hidden", true);
                }
                document.getElementById("load-cancel-btn").onclick = function(){
                    document.getElementById("save-menu").classList.toggle("hidden", true);
                }
            }
        })
    }
}

function printContent(json, stage, layer, wireLayer) {
    for (let aNode of json.nodesData) {
        try {
            new Nodes.ProgramNode(aNode.nodeDescription, { x: aNode.position.x * stage.scaleX() + stage.x(), y: aNode.position.y * stage.scaleY() + stage.y() }, layer, stage);

        }
        catch (err) {
            writeError(err, "Error Occurred In Importing The JSON(Node Description Not Valid)");
        }
    }
    // let X = layer.findOne('Group');
    // console.log(layer.children);
    // console.log(X); 
    for (let aWire of json.wireData) {
        // console.log(`${aWire.srcId}`, `${aWire.destId}`);
        let src = layer.findOne(`#${aWire.srcId}`);
        let dest = layer.findOne(`#${aWire.destId}`);
        // console.log(src, dest);
        try {
            addConnectionWire(dest, src, stage, 1, wireLayer);
        }
        catch (err) {
            writeError(err, "Error Occurred In Importing The JSON(Wire Data Not Valid)");
        }
    }
    for (let aVariable of json.variables) {
        try {
            variableList.addVariable(aVariable);
        }
        catch (err) {
            writeError(err, "Error Occurred In Importing The JSON(Variable Data Not Valid)");
        }
    }
    layer.draw();
    wireLayer.draw();
}
