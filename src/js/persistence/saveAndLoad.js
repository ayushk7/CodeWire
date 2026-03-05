import { Nodes } from '../nodes/nodeFactory.js'
import { addConnectionWire } from '../nodes/wiring.js'
import { variableList } from '../ui/variableList.js'
import { showAlert, vscriptOnLoad } from '../ui/dialogs.js'
import { getGroupsData, createNodeGroup } from '../editor/nodeGroup.js'
import { tabManager } from '../editor/tabManager.js'
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
function serializeLayerData(layer, wireLayer) {
    const nodesData = [];
    const wireData = [];
    layer.find('.aProgramNodeGroup').forEach((node) => {
        if (node.name() === 'aProgramNodeGroup') {
            nodesData.push({
                position: node.position(),
                nodeDescription: node.customClass.nodeDescription,
            });
        }
    });
    wireLayer.find('.isConnection').forEach((aWire) => {
        if (aWire.name() === 'isConnection') {
            wireData.push({
                srcId: aWire.attrs.src.id(),
                destId: aWire.attrs.dest.id(),
            });
        }
    });
    return { nodesData, wireData };
}

function buildFullExportData(layer, wireLayer) {
    const { nodesData, wireData } = serializeLayerData(layer, wireLayer);
    const mainTab = tabManager.getTab('main');
    const globalVars = mainTab ? mainTab.variables : variableList.variables;
    const funcTabs = tabManager.getAllFunctionTabs();
    const functions = funcTabs.map(ft => {
        const ftData = serializeLayerData(ft.layer, ft.wireLayer);
        return {
            name: ft.name,
            inputParams: ft.inputParams.map(p => ({ name: p.name, dataType: p.dataType, defValue: p.defValue })),
            outputParams: ft.outputParams.map(p => ({ name: p.name, dataType: p.dataType })),
            variables: ft.variables.map(v => ({ name: v.name, dataType: v.dataType, value: v.value })),
            docString: ft.docString || '',
            nodesData: ftData.nodesData,
            wireData: ftData.wireData,
            groupsData: getGroupsData(ft.layer),
        };
    });
    return {
        variables: globalVars,
        nodesData,
        wireData,
        groupsData: getGroupsData(layer),
        functions,
    };
}

export class Export {
    constructor(stage, layer, wireLayer) {
        document.getElementById('export').addEventListener("click", (e) => {
            const exportScript = buildFullExportData(layer, wireLayer);
            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportScript));
            let exportAnchorElem = document.getElementById('exportAnchorElem');
            exportAnchorElem.setAttribute("href", dataStr);
            const ts = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
            exportAnchorElem.setAttribute("download", `wireScript_${ts}.json`);
            exportAnchorElem.click();
        });
    }
}
export function refresh(layer, wireLayer) {
    const funcTabs = tabManager.getAllFunctionTabs();
    for (const ft of [...funcTabs]) {
        tabManager.closeTab(ft.id);
    }
    if (tabManager.getActiveTabId() !== 'main') {
        tabManager.switchTab('main');
    }
    layer.destroyChildren();
    wireLayer.destroyChildren();
    variableList.deleteAllVariables();
    const mainTab = tabManager.getTab('main');
    if (mainTab) mainTab.variables = variableList.variables;
    layer.draw();
    wireLayer.draw();
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
            const exportScript = buildFullExportData(layer, wireLayer);
            localStorage.setItem('lastLoadWireScriptJSON', JSON.stringify(exportScript));
            let savingWindow = document.getElementById("saving");
            // let importMenu = document.getElementById("import-menu");
            [...document.getElementsByClassName("sidebox")].forEach(value => {
                if (value !== savingWindow) {
                    value.classList.toggle("hidden", true);
                }
                else {
                    value.classList.toggle("hidden", false);
                }
            })
            setTimeout(() => {
                savingWindow.classList.toggle("hidden", true);
            }, 600);

        });
        window.addEventListener("load", () => {
            // console.log("loaded");
            prompLastSave(stage, layer, wireLayer);
        })
    }
}

export function prompLastSave(stage, layer, wireLayer) {
    let saveMenu = document.getElementById("save-menu");
    [...document.getElementsByClassName("sidebox")].forEach(value => {
        value.classList.toggle("hidden", true);
    });
    // document.getElementById("saving").classList.toggle("hidden", true);
    // document.getElementById("import-menu").classList.toggle("hidden", true);
    if (localStorage.getItem('lastLoadWireScriptJSON') && localStorage.getItem('lastLoadWireScriptJSON') != "{\"variables\":[],\"nodesData\":[],\"wireData\":[]}") {
        saveMenu.classList.toggle("hidden", false);
        document.getElementById("load-btn").onclick = function () {
            new Import(stage, layer, wireLayer, localStorage.getItem('lastLoadWireScriptJSON'));
            saveMenu.classList.toggle("hidden", true);
        };
        document.getElementById("load-cancel-btn").onclick = function () {
            saveMenu.classList.toggle("hidden", true);
        };
    }
    else{
        vscriptOnLoad(stage);
        showAlert('No Previous Save Was Found');
    }
}

function loadLayerContent(nodesData, wireData, targetLayer, wireLayer, stage) {
    for (let aNode of nodesData) {
        try {
            new Nodes.ProgramNode(aNode.nodeDescription,
                { x: aNode.position.x * stage.scaleX() + stage.x(), y: aNode.position.y * stage.scaleY() + stage.y() },
                targetLayer, stage);
        } catch (err) {
            writeError(err, "Error Occurred In Importing The JSON(Node Description Not Valid)");
        }
    }
    for (let aWire of wireData) {
        let src = targetLayer.findOne(`#${aWire.srcId}`);
        let dest = targetLayer.findOne(`#${aWire.destId}`);
        try {
            addConnectionWire(dest, src, stage, 1, wireLayer);
        } catch (err) {
            writeError(err, "Error Occurred In Importing The JSON(Wire Data Not Valid)");
        }
    }
}

function printContent(json, stage, layer, wireLayer) {
    loadLayerContent(json.nodesData, json.wireData, layer, wireLayer, stage);

    const mainTab = tabManager.getTab('main');
    for (let aVariable of json.variables) {
        try {
            variableList.addVariable(aVariable);
        } catch (err) {
            writeError(err, "Error Occurred In Importing The JSON(Variable Data Not Valid)");
        }
    }
    if (mainTab) mainTab.variables = variableList.variables;
    if (json.groupsData) {
        for (let g of json.groupsData) {
            try {
                createNodeGroup(g.position, g.width, g.height, g.name, layer, stage);
            } catch (err) {
                writeError(err, "Error Occurred In Importing The JSON(Group Data Not Valid)");
            }
        }
    }

    if (json.functions && json.functions.length > 0) {
        for (const funcData of json.functions) {
            try {
                tabManager._suppressAutoNodes = true;
                const tab = tabManager.createTab(funcData.name);
                tabManager._suppressAutoNodes = false;
                if (!tab) continue;

                tab.inputParams = funcData.inputParams || [];
                tab.outputParams = funcData.outputParams || [];
                tab.variables = funcData.variables || [];
                tab.docString = funcData.docString || '';

                loadLayerContent(funcData.nodesData, funcData.wireData, tab.layer, tab.wireLayer, stage);

                const beginNode = tab.layer.findOne('#FunctionBegin');
                if (beginNode) tab.beginNodeId = beginNode.id();
                const returnNode = tab.layer.findOne('#Return');
                if (returnNode) tab.returnNodeId = returnNode.id();

                if (funcData.groupsData) {
                    for (let g of funcData.groupsData) {
                        createNodeGroup(g.position, g.width, g.height, g.name, tab.layer, stage);
                    }
                }

                tab.layer.draw();
                tab.wireLayer.draw();
            } catch (err) {
                tabManager._suppressAutoNodes = false;
                writeError(err, "Error Occurred In Importing The JSON(Function Data Not Valid)");
            }
        }
        tabManager.switchTab('main');
    }

    layer.draw();
    wireLayer.draw();
}
