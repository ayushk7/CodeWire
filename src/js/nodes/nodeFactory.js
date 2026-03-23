import { InputBox } from './nodeInputBox.js'
import { colorMap } from '../core/colorMap.js'
import { setLocationOfNode } from './nodePosition.js';
import { buildNodeDescription, hasType } from '../registry/index.js';
import { deleteNodeByGroup, deleteWire } from '../editor/deleteHandler.js';
import { tabManager } from '../editor/tabManager.js';
import { addConnectionWire } from './wiring.js';
import { applyMismatchToWire, isTypeCompatible } from '../utils/wireMismatch.js';

let placeLocation = function (location) {
    //"this" is stage
    return {
        x: (location.x - this.x()) / this.scaleX(),
        y: (location.y - this.y()) / this.scaleY()
    };
}
export var Nodes = {
    countNodes: 0,
    getExecPin: function (inType, helper, layer) {
        // let pointsExecIn = [0, 0, -14, -7, -14, 7];
        // let pointsExecOut = []
        let pin = new Konva.Line({
            points: [0, 0, -14, -7, -14, 7],
            stroke: 'white',
            strokeWidth: 2,
            hitStrokeWidth: 10,
            closed: true,
            helper: helper,
            name: 'pin',
            offsetX: (inType) ? -14 : 0,
            pinType: (inType) ? 'exec-in' : 'exec-out',
            pinDataType: null,
            fill: '',
        });
        pin.on("mouseenter", () => {
            pin.strokeWidth(4);
            layer.draw();
        });
        pin.on("mouseleave", () => {
            pin.strokeWidth(2);
            layer.draw();
        });
        pin.on("wireremoved", (e) => {
            if (e.isPinEmpty) {
                pin.fill('transparent');
            }
        });
        pin.on("wireconnected", (e) => {
            pin.fill("white");
        });
        pin.on("wiringstart", (e) => {
            pin.fill("white");
            layer.draw();
        });
        return pin;
    },
    getRectBlock: function (height, width) {
        let rect = new Konva.Rect({
            height: height,
            width: width,
            // fill: colorMap['MainBox'],
            opacity: 0.8,
            cornerRadius: 5,
            shadowColor: 'black',
            shadowBlur: 15,
            shadowOffset: { x: 15, y: 15 },
            shadowOpacity: 0.5,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: width, y: height },
            fillLinearGradientColorStops: [0, colorMap['MainBoxGradient']['start'], 1, colorMap['MainBoxGradient']['end']],
            // fillLinearGradientColorStops: [0, '#12100e', 1, '#2b4162'],

            // strokeWidth: [10, 10, 110, 0],
        });
        return rect;
    },
    getInputPin: function (inType, helper, type, layer) {
        let pin = new Konva.Circle({
            radius: 7,
            stroke: colorMap[type],
            strokeWidth: 2,
            hitStrokeWidth: 10,
            name: 'pin',
            pinType: (inType) ? 'inp' : 'outp',
            pinDataType: type,
            offsetX: (inType) ? -7 : 7,
            helper: helper,
            fill: '',
        });
        pin.on("mouseenter", () => {
            pin.strokeWidth(4);
            layer.draw();
        });
        pin.on("mouseleave", () => {
            pin.strokeWidth(2);
            layer.draw();
        });
        pin.on("wireremoved", (e) => {
            if (e.isPinEmpty) {
                pin.fill('transparent');
            }
        });
        pin.on("wireconnected", (e) => {
            pin.fill(`${colorMap[type]}`);
        });
        pin.on("wiringstart", (e) => {
            pin.fill(`${colorMap[type]}`);
            layer.draw();
        });
        return pin;
    },
    // getOutputPin: function(){
    //     let pin = new Konva.Circle({
    //         radius: 7,
    //         stroke: 'yellow',
    //         strokeWidth: '2',
    //         name: 'pin',
    //         pinType: 'outp',
    //     });
    //     return pin;
    // },
    getLabel: function (text, size, width, color) {
        let rect = new Konva.Rect({
            width: width,
            height: size + 3,
            fill: colorMap[color],
            cornerRadius: [5, 5, 0, 0],
            // fillLinearGradientStartPoint: { x: 0, y: 0 },
            // fillLinearGradientEndPoint: { x: width, y: size + 3 },
            // fillLinearGradientColorStops: [0, colorMap[color], 1, 'rgba(0, 0, 0, 0)'],
            // fillRadialGradientStartPoint: {x: 0, y: 0},
            // fillRadialGradientEndPoint: { x: 30, y: 0 },
            // fillRadialGradientColorStops: [0, colorMap[color], 1, '#2d3436'],
            // fillRadialGradientStartRadius: size / 3,
            // fillRadialGradientEndRadius: 100,

            // fillLinearGradientColorStops: [0, '#9e768f', 1, '#ff4e00'],

            // #ec9f05 #ff4e00
        });
        let label = new Konva.Text({
            text: text,
            fontSize: size - 5,
            fontFamily: 'Verdana',
            fill: colorMap['MainLabel'],
            width: width,
            // height: size + 3,
            y: 2,
            align: 'left',
            padding: 3,
            // padding: 10
        });
        return { bg: rect, text: label };
    },
    getPinCounts: function (nodeDescription) {
        let inputPinCounts = 0;
        let outputPinCounts = 0;
        if (nodeDescription.execIn)
            inputPinCounts++;
        if (nodeDescription.inputs) {
            inputPinCounts += Object.keys(nodeDescription.inputs).length;
        }

        //For outputs
        if (nodeDescription.execOut) {
            outputPinCounts += Object.keys(nodeDescription.execOut).length;
        }
        if (nodeDescription.outputs) {
            outputPinCounts += Object.keys(nodeDescription.outputs).length;

        }
        return Math.max(inputPinCounts, outputPinCounts);
    },
    // getEditableTextBox: function (type, stage, index) {
    //     let rect = new Konva.Rect({
    //         width: (type == 'Boolean') ? 14 : 50,
    //         height: 14,
    //         stroke: colorMap[type],
    //         strokeWidth: 1,
    //     });
    //     return rect;
    // },
    getInputLabel: function (labelText, isInput) {
        let text = new Konva.Text({
            // width: 40,
            height: 14,
            text: labelText,
            fontSize: 11,
            fontFamily: 'Verdana',
            fill: colorMap['Text'],
        });
        if (isInput)
            text.offsetX(0);
        else
            text.offsetX(text.width());
        // text.off()
        return text;
    },
    getExecOutTitle: function (labelText) {
        let text = new Konva.Text({
            height: 14,
            fontSize: 11,
            text: labelText,
            fontFamily: 'Verdana',
            fill: "white",
        });
        text.offsetX(text.width());
        return text;
    },
    optimizeDrag: function (grp, stage, layer) {
        function moveWireToLayer(aWire, targetLayer) {
            aWire.moveTo(targetLayer);
            if (aWire._closeIndicator) aWire._closeIndicator.moveTo(targetLayer);
        }
        grp.on('dragstart', () => {
            let dragLayer = tabManager.getDragLayer();
            let wireLayer = tabManager.getActiveWireLayer();
            grp.moveTo(dragLayer);
            for (let each of grp.customClass.execInPins) {
                for (let aWire of each.wire) {
                    moveWireToLayer(aWire, dragLayer);
                }
            }
            for (let each of grp.customClass.execOutPins) {
                if (each.wire)
                    moveWireToLayer(each.wire, dragLayer);
            }
            for (let each of grp.customClass.inputPins) {
                if (each.wire)
                    moveWireToLayer(each.wire, dragLayer);
            }
            for (let each of grp.customClass.outputPins) {
                for (let aWire of each.wire) {
                    moveWireToLayer(aWire, dragLayer);
                }
            }
            wireLayer.draw();
            dragLayer.draw();
            layer.draw();
        })
        grp.on('dragend', () => {
            let dragLayer = tabManager.getDragLayer();
            let wireLayer = tabManager.getActiveWireLayer();
            grp.moveTo(layer);
            for (let each of grp.customClass.execInPins) {
                for (let aWire of each.wire) {
                    moveWireToLayer(aWire, wireLayer);
                }
            }
            for (let each of grp.customClass.execOutPins) {
                if (each.wire)
                    moveWireToLayer(each.wire, wireLayer);
            }
            for (let each of grp.customClass.inputPins) {
                if (each.wire)
                    moveWireToLayer(each.wire, wireLayer);
            }
            for (let each of grp.customClass.outputPins) {
                for (let aWire of each.wire) {
                    moveWireToLayer(aWire, wireLayer);
                }
            }
            wireLayer.draw();
            dragLayer.draw();
            layer.draw();
        });
    },
    getBorderRect: function (height, width) {
        let rect = new Konva.Rect({
            height: height,
            width: width,
            fill: 'transparent',
            stroke: '#dbd8e3',
            strokeWidth: 0,
            cornerRadius: 5,
            name: 'borderbox',
        });
        rect.off('click mouseover mouseenter mouseleave');
        return rect;
    },
    ProgramNode: class {
        constructor(nodeDescription, location, layer, stage) {



            this.grp = new Konva.Group({
                draggable: true,
                name: "aProgramNodeGroup",
            });
            if (nodeDescription.nodeTitle == 'Begin') {
                this.grp.id('Begin');
            } else if (nodeDescription.nodeTitle == 'FunctionBegin') {
                this.grp.id('FunctionBegin');
            } else if (nodeDescription.nodeTitle == 'Return') {
                this.grp.id('Return');
            }
            this.isDeletable = nodeDescription.isDeletable !== false;
            this.grp.customClass = this;
            // this.grp.on('dblclick', (e) => {
            //     console.table(e.currentTarget.customClass);
            // })
            this.nodeDescription = nodeDescription;
            let relativePosition = placeLocation.bind(stage);
            let maxOfPinsOnEitherSide = Nodes.getPinCounts(nodeDescription);
            let height = maxOfPinsOnEitherSide * 50 + 15;
            let width = nodeDescription.colums * 15;
            this.grp.position(relativePosition(location));
            let rect = Nodes.getRectBlock(height, width);
            this.bodyRect = rect;
            this.grp.add(rect);
            let borderRect = Nodes.getBorderRect(height, width);
            let titleLabel = Nodes.getLabel(nodeDescription.nodeTitle, 20, width, nodeDescription.color);
            this.titleBg = titleLabel.bg;
            this.titleText = titleLabel.text;
            this.grp.add(titleLabel.bg);
            this.grp.add(titleLabel.text);
            this.grp.add(borderRect);

            let closeBtn = null;
            if (nodeDescription.nodeTitle !== 'Begin' && nodeDescription.isDeletable !== false) {
                const btnSize = 16;
                const btnX = width - btnSize - 4;
                const btnY = Math.round((23 - btnSize) / 2);
                closeBtn = new Konva.Group({ x: btnX, y: btnY, visible: false });
                const btnBg = new Konva.Rect({
                    width: btnSize,
                    height: btnSize,
                    fill: 'rgba(0,0,0,0.5)',
                    cornerRadius: 3,
                });
                const btnText = new Konva.Text({
                    text: '\u00D7',
                    fontSize: 14,
                    fontFamily: 'Verdana',
                    fill: '#fff',
                    width: btnSize,
                    height: btnSize,
                    align: 'center',
                    verticalAlign: 'middle',
                });
                closeBtn.add(btnBg);
                closeBtn.add(btnText);
                closeBtn.on('mouseenter', () => {
                    btnBg.fill('rgba(200,50,50,0.85)');
                    document.body.style.cursor = 'pointer';
                    layer.draw();
                });
                closeBtn.on('mouseleave', () => {
                    btnBg.fill('rgba(0,0,0,0.5)');
                    document.body.style.cursor = 'default';
                    layer.draw();
                });
                closeBtn.on('mousedown', (e) => {
                    e.cancelBubble = true;
                });
                closeBtn.on('click', (e) => {
                    e.cancelBubble = true;
                    document.body.style.cursor = 'default';
                    deleteNodeByGroup(this.grp, stage);
                });
                this.grp.add(closeBtn);
            }

            this.grp.on("mouseover", (e) => {
                borderRect.strokeWidth(1);
                if (closeBtn) closeBtn.visible(true);
                layer.draw();
            });
            this.grp.on("mouseleave", (e) => {
                borderRect.strokeWidth(0);
                if (closeBtn) closeBtn.visible(false);
                layer.draw();
            });
            this.grp.on('mousedown', (e) => {
                rect.shadowBlur(25);
                // rect.shadowOffset({ x: 25, y: 25 });
                layer.draw();
            })
            this.grp.on('mouseup', (e) => {
                rect.shadowBlur(15);
                // rect.shadowOffset({ x: 15, y: 15 });
                layer.draw();
            })
            /****/

            Nodes.optimizeDrag(this.grp, stage, layer);

            /****/
            // titleLabel.offsetX(titleLabel.width() / 2);
            let inputPinsPlaced = 0, outputPinsPlaced = 0;
            this.execInPins = [];
            if (nodeDescription.execIn == true) {
                let execInPin = Nodes.getExecPin(true, 'exec-in-0', layer);
                execInPin.position({ x: 7, y: 44 });
                if (nodeDescription.pinExecInId == null) {
                    execInPin.id(`${execInPin._id}`);
                }
                else {
                    execInPin.id(nodeDescription.pinExecInId);
                }
                this.nodeDescription.pinExecInId = execInPin.id();
                this.grp.add(execInPin);
                let tmp = {
                    thisNode: execInPin,
                    wire: [],
                }
                this.execInPins.push(tmp);
                inputPinsPlaced = 1;
            }

            let X = nodeDescription.nodeTitle.split(" ");
            this.type = {
                isGetSet: (X[0] == 'Get' || X[0] == 'Set'),
                typeOfNode: nodeDescription.nodeTitle,
            }
            this.execOutPins = [];
            if (nodeDescription.execOut) {
                Object.keys(nodeDescription.execOut).forEach((value, index) => {
                    let execOutPin = Nodes.getExecPin(false, `exec-out-${index}`, layer);
                    execOutPin.position({ x: width - 7, y: 44 + nodeDescription.execOut[value].outOrder * 39 });
                    if (nodeDescription.execOut[value].pinExecOutId == null) {
                        execOutPin.id(`${execOutPin._id}`);
                    }
                    else {
                        execOutPin.id(nodeDescription.execOut[value].pinExecOutId);
                    }
                    this.nodeDescription.execOut[value].pinExecOutId = execOutPin.id();
                    this.grp.add(execOutPin);
                    if (nodeDescription.execOut[value].execOutTitle) {
                        let exLabel = Nodes.getExecOutTitle(nodeDescription.execOut[value].execOutTitle);
                        exLabel.position({ x: width - 28, y: 44 + nodeDescription.execOut[value].outOrder * 39 - 4 });
                        this.grp.add(exLabel);
                    }
                    let tmp = {
                        thisNode: execOutPin,
                        wire: null,
                        title: value.execOutTitle,
                    }
                    this.execOutPins.push(tmp);
                    outputPinsPlaced++;
                });
            }
            this.inputPins = [];
            if (nodeDescription.inputs) {
                Object.keys(nodeDescription.inputs).forEach((value, index) => {
                    let inputPin = Nodes.getInputPin(true, `inp-${index}`, nodeDescription.inputs[value].dataType, layer);
                    inputPin.position({ x: 7, y: 44 + 39 * inputPinsPlaced });
                    if (nodeDescription.inputs[value].pinInId == null) {
                        inputPin.id(`${inputPin._id}`);
                    }
                    else {
                        inputPin.id(nodeDescription.inputs[value].pinInId);
                    }
                    this.nodeDescription.inputs[value].pinInId = inputPin.id();
                    // iprect.position({ x: 28, y: 44 + 39 * inputPinsPlaced - 2 });
                    let iprect = null;
                    let iplabel = Nodes.getInputLabel(nodeDescription.inputs[value].inputTitle, true);
                    iplabel.position({ x: 28, y: 44 + 39 * inputPinsPlaced - 4 });
                    if (nodeDescription.inputs[value].isInputBoxRequired !== false) {
                        // console.log(nodeDescription.inputs, this.nodeDescription.inputs);
                        iprect = new InputBox(stage, layer, nodeDescription.inputs[value].dataType, this.grp, { x: 28, y: 44 + 39 * inputPinsPlaced - 2 }, colorMap, inputPin, iplabel, inputPinsPlaced, nodeDescription.inputs[value], this.nodeDescription.inputs[value]);
                        iplabel.position({ x: 28, y: 44 + 39 * inputPinsPlaced - 14 });
                    }
                    this.grp.add(iplabel);
                    this.grp.add(inputPin);
                    // this.grp.add(iprect);
                    let tmp = {
                        thisNode: inputPin,
                        wire: null,
                        textBox: iprect,
                        value: null,
                        title: value.inputTitle,
                    }
                    this.inputPins.push(tmp);
                    inputPinsPlaced++;
                });
            }
            this.outputPins = [];
            if (nodeDescription.outputs) {
                Object.keys(nodeDescription.outputs).forEach((value, index) => {
                    let outputPin = Nodes.getInputPin(false, `out-${index}`, nodeDescription.outputs[value].dataType, layer);
                    outputPin.position({ x: width - 7, y: 44 + 39 * nodeDescription.outputs[value].outOrder });
                    if (nodeDescription.outputs[value].pinOutId == null) {
                        outputPin.id(`${outputPin._id}`);
                    }
                    else {
                        outputPin.id(nodeDescription.outputs[value].pinOutId);
                    }
                    nodeDescription.outputs[value].pinOutId = outputPin.id();
                    this.grp.add(outputPin);
                    let outLabel = Nodes.getInputLabel(nodeDescription.outputs[value].outputTitle, false);
                    outLabel.position({ x: width - 28, y: 44 + 39 * nodeDescription.outputs[value].outOrder - 4 })
                    this.grp.add(outLabel);
                    let tmp = {
                        wire: [],
                        value: null,
                        title: value.outputTitle,
                    }
                    this.outputPins.push(tmp);
                    outputPinsPlaced++;
                })
            };
            // this.grp.cache();
            layer.add(this.grp);
            layer.draw();
            layer.draw();
            // console.log(JSON.parse(JSON.stringify(this.grp)));
        }
    },





    CreateNode: function (type, location, layer, stage, isGetSet, dataType, defValue) {
        let nodeDescription = null;
        if (hasType(type)) {
            nodeDescription = buildNodeDescription(type);
        } else if (isGetSet === 'Set' || isGetSet === 'Get') {
            nodeDescription = {};
            if (isGetSet == "Set") {
                let defaultValueByType = { "Number": 0, "Boolean": true, "String": "'hello'", "Array": '[]' };
                nodeDescription.nodeTitle = type;
                nodeDescription.execIn = true;
                nodeDescription.pinExecInId = null;
                nodeDescription.execOut = { execOut0: { execOutTitle: null, pinExecOutId: null, outOrder: 0 } };
                nodeDescription.inputs = { input0: { inputTitle: 'Value', dataType: dataType, defValue: defaultValueByType[dataType], pinInId: null } };
                nodeDescription.outputs = { output0: { outputTitle: 'Value(Ref)', dataType: dataType, pinOutId: null, outOrder: 1 } };
                nodeDescription.color = 'Func';
                nodeDescription.rows = 2;
                nodeDescription.colums = 12;
            }
            if (isGetSet == "Get") {
                nodeDescription.nodeTitle = type;
                nodeDescription.outputs = { output0: { outputTitle: 'Value(Ref)', dataType: dataType, pinOutId: null, outOrder: 0 } };
                nodeDescription.color = 'Get';
                nodeDescription.rows = 2;
                nodeDescription.colums = 10;
            }
        }
        if (!nodeDescription) return;
        new this.ProgramNode(nodeDescription, location, layer, stage);
    },

    buildFunctionBeginDescription: function (inputParams) {
        const nd = {
            nodeTitle: 'FunctionBegin',
            execIn: false,
            pinExecInId: null,
            execOut: { execOut0: { execOutTitle: null, pinExecOutId: null, outOrder: 0 } },
            color: 'FunctionBegin',
            rows: 2,
            colums: 12,
            isDeletable: false,
        };
        if (inputParams && inputParams.length > 0) {
            nd.outputs = {};
            inputParams.forEach((p, i) => {
                nd.outputs[`output${i}`] = {
                    outputTitle: p.name,
                    dataType: p.dataType,
                    pinOutId: null,
                    outOrder: i + 1,
                };
            });
            nd.rows = Math.max(2, inputParams.length + 1);
        }
        return nd;
    },

    buildReturnDescription: function (outputParams) {
        const nd = {
            nodeTitle: 'Return',
            execIn: true,
            pinExecInId: null,
            color: 'Return',
            rows: 2,
            colums: 12,
            isDeletable: false,
        };
        if (outputParams && outputParams.length > 0) {
            nd.inputs = {};
            outputParams.forEach((p, i) => {
                nd.inputs[`input${i}`] = {
                    inputTitle: p.name,
                    dataType: p.dataType,
                    defValue: null,
                    pinInId: null,
                    isInputBoxRequired: false,
                };
            });
            nd.rows = Math.max(2, outputParams.length + 1);
        }
        return nd;
    },

    CreateFunctionBeginNode: function (inputParams, location, layer, stage) {
        const nd = this.buildFunctionBeginDescription(inputParams);
        const node = new this.ProgramNode(nd, location, layer, stage);
        node.grp.id('FunctionBegin');
        return node;
    },

    CreateReturnNode: function (outputParams, location, layer, stage) {
        const nd = this.buildReturnDescription(outputParams);
        const node = new this.ProgramNode(nd, location, layer, stage);
        node.grp.id('Return');
        return node;
    },

    rebuildFunctionBeginNode: function (node, inputParams, layer, stage, wireLayer) {
        const programNode = node;
        const grp = programNode.grp;
        const oldNd = programNode.nodeDescription;
        const oldOutputs = oldNd.outputs ? Object.keys(oldNd.outputs).sort().map(k => oldNd.outputs[k]) : [];

        const savedOutputs = [];
        for (let j = 0; j < programNode.outputPins.length; j++) {
            const pin = programNode.outputPins[j];
            const wires = [...(Array.isArray(pin.wire) ? pin.wire : (pin.wire ? [pin.wire] : []))].filter(Boolean);
            savedOutputs[j] = wires.map(w => {
                const destPin = w.attrs.dest;
                const oldType = oldOutputs[j]?.dataType;
                deleteWire(w);
                return { destPin, oldType };
            });
        }

        const savedExecOuts = [];
        for (let j = 0; j < programNode.execOutPins.length; j++) {
            const ep = programNode.execOutPins[j];
            if (ep.wire) {
                const destPin = ep.wire.attrs.dest;
                deleteWire(ep.wire);
                savedExecOuts[j] = destPin;
            }
        }

        const pos = grp.position();
        const grpId = grp.id();
        grp.destroy();

        const newNd = this.buildFunctionBeginDescription(inputParams);
        const newNode = new this.ProgramNode(newNd, {
            x: pos.x * stage.scaleX() + stage.x(),
            y: pos.y * stage.scaleY() + stage.y()
        }, layer, stage);
        newNode.grp.id(grpId);
        const newCC = newNode.grp.customClass;

        for (let j = 0; j < savedExecOuts.length; j++) {
            if (!savedExecOuts[j]) continue;
            const newExecOutPin = newCC.execOutPins[j]?.thisNode;
            if (newExecOutPin) {
                addConnectionWire(savedExecOuts[j], newExecOutPin, stage, 1, wireLayer);
            }
        }

        const outPins = newNode.grp.find('.pin').filter(p => p.attrs.pinType === 'outp');
        outPins.sort((a, b) => {
            const ai = parseInt(String(a.attrs.helper || '').split('-')[1], 10) || 0;
            const bi = parseInt(String(b.attrs.helper || '').split('-')[1], 10) || 0;
            return ai - bi;
        });

        for (let j = 0; j < savedOutputs.length && j < (inputParams || []).length; j++) {
            const newSrcPin = outPins[j];
            if (!newSrcPin) continue;
            for (const { destPin, oldType } of savedOutputs[j]) {
                addConnectionWire(destPin, newSrcPin, stage, 1, wireLayer);
                const newType = (inputParams || [])[j]?.dataType;
                if (!isTypeCompatible(newType, destPin.attrs.pinDataType)) {
                    const inpIdx = destPin.attrs.helper ? parseInt(String(destPin.attrs.helper).split('-')[1], 10) : 0;
                    const wireToMark = destPin.getParent().customClass?.inputPins?.[inpIdx]?.wire;
                    if (wireToMark) applyMismatchToWire(wireToMark, wireLayer, stage);
                }
            }
        }
        return newNode;
    },

    buildCallNodeDescription: function (funcName, inputParams, outputParams, docString) {
        const nd = {
            nodeTitle: `Call ${funcName}`,
            execIn: true,
            pinExecInId: null,
            execOut: { execOut0: { execOutTitle: null, pinExecOutId: null, outOrder: 0 } },
            color: 'Call',
            rows: 2,
            colums: 14,
            isCallFunction: true,
            calledFunctionName: funcName,
            docString: docString || '',
        };
        const maxPins = Math.max(
            (inputParams ? inputParams.length : 0),
            (outputParams ? outputParams.length : 0)
        );
        nd.rows = Math.max(2, maxPins + 1);
        if (inputParams && inputParams.length > 0) {
            nd.inputs = {};
            const defByType = { Number: 0, Boolean: true, String: "'hello'", Array: '[]' };
            inputParams.forEach((p, i) => {
                const defVal = p.defValue != null ? p.defValue : defByType[p.dataType];
                nd.inputs[`input${i}`] = {
                    inputTitle: p.name,
                    dataType: p.dataType,
                    defValue: defVal,
                    pinInId: null,
                    isInputBoxRequired: true,
                };
            });
        }
        if (outputParams && outputParams.length > 0) {
            nd.outputs = {};
            outputParams.forEach((p, i) => {
                nd.outputs[`output${i}`] = {
                    outputTitle: p.name,
                    dataType: p.dataType,
                    pinOutId: null,
                    outOrder: i + 1,
                };
            });
        }
        return nd;
    },

    CreateCallNode: function (funcName, inputParams, outputParams, location, layer, stage, docString) {
        const nd = this.buildCallNodeDescription(funcName, inputParams, outputParams, docString);
        return new this.ProgramNode(nd, location, layer, stage);
    },

    updateCallNodesDocString: function (funcName, docString) {
        const allTabs = tabManager.getAllTabs();
        for (const tab of allTabs) {
            const layer = tab.layer;
            if (!layer) continue;
            layer.find('.aProgramNodeGroup').forEach((grp) => {
                const cc = grp.customClass;
                if (!cc || !cc.nodeDescription || !cc.nodeDescription.isCallFunction || cc.nodeDescription.calledFunctionName !== funcName) return;
                cc.nodeDescription.docString = docString || '';
            });
        }
    },

    /**
     * Update all Call nodes that call the given function with the current definition.
     * Smart wire matching: preserve wires when params match by index; remove wires for
     * deleted params; apply dashed mismatch when type changes.
     */
    updateCallNodesToDefinition: function (funcName, inputParams, outputParams, docString) {
        const allTabs = tabManager.getAllTabs();
        const stage = tabManager.getStage();
        const inputParamsArr = inputParams || [];
        const outputParamsArr = outputParams || [];

        for (const tab of allTabs) {
            const layer = tab.layer;
            const wireLayer = tab.wireLayer;
            if (!layer || !wireLayer) continue;

            const toUpdate = [];
            layer.find('.aProgramNodeGroup').forEach((grp) => {
                const cc = grp.customClass;
                if (!cc || !cc.nodeDescription || !cc.nodeDescription.isCallFunction || cc.nodeDescription.calledFunctionName !== funcName) return;
                if (cc.isOrphaned) return;
                toUpdate.push({ grp, layer, wireLayer, programNode: cc });
            });

            for (const { grp, layer, wireLayer, programNode } of toUpdate) {
                const nd = programNode.nodeDescription;
                const oldInputs = nd.inputs ? Object.keys(nd.inputs).sort().map(k => nd.inputs[k]) : [];
                const oldOutputs = nd.outputs ? Object.keys(nd.outputs).sort().map(k => nd.outputs[k]) : [];

                const savedInputs = [];
                for (let i = 0; i < programNode.inputPins.length; i++) {
                    const pin = programNode.inputPins[i];
                    if (pin.wire) {
                        savedInputs[i] = { srcPin: pin.wire.attrs.src, oldType: oldInputs[i]?.dataType };
                        deleteWire(pin.wire);
                    }
                }

                const savedOutputs = [];
                for (let j = 0; j < programNode.outputPins.length; j++) {
                    const pin = programNode.outputPins[j];
                    const wires = [...(Array.isArray(pin.wire) ? pin.wire : (pin.wire ? [pin.wire] : []))].filter(Boolean);
                    savedOutputs[j] = wires.map(w => {
                        const destPin = w.attrs.dest;
                        const oldType = oldOutputs[j]?.dataType;
                        deleteWire(w);
                        return { destPin, oldType };
                    });
                }

                const savedExecIn = [];
                if (programNode.execInPins && programNode.execInPins[0]) {
                    const wires = [...(programNode.execInPins[0].wire || [])].filter(Boolean);
                    for (const w of wires) {
                        savedExecIn.push({ srcPin: w.attrs.src });
                        deleteWire(w);
                    }
                }

                const savedExecOut = [];
                if (programNode.execOutPins) {
                    for (const ep of programNode.execOutPins) {
                        if (ep.wire) {
                            savedExecOut.push({ destPin: ep.wire.attrs.dest });
                            deleteWire(ep.wire);
                        }
                    }
                }

                const pos = grp.position();
                grp.destroy();

                const newNode = Nodes.CreateCallNode(funcName, inputParamsArr, outputParamsArr, pos, layer, stage, docString || '');
                const newCC = newNode.grp.customClass;

                for (let i = 0; i < savedInputs.length && i < inputParamsArr.length; i++) {
                    const saved = savedInputs[i];
                    if (!saved) continue;
                    const newDestPin = newCC.inputPins[i]?.thisNode;
                    if (!newDestPin) continue;
                    addConnectionWire(newDestPin, saved.srcPin, stage, 1, wireLayer);
                    const newType = inputParamsArr[i]?.dataType;
                    if (!isTypeCompatible(saved.srcPin.attrs.pinDataType, newType)) {
                        const wire = newCC.inputPins[i].wire;
                        if (wire) applyMismatchToWire(wire, wireLayer, stage);
                    }
                }

                const outPins = newNode.grp.find('.pin').filter(p => p.attrs.pinType === 'outp');
                outPins.sort((a, b) => {
                    const ai = parseInt(String(a.attrs.helper || '').split('-')[1], 10) || 0;
                    const bi = parseInt(String(b.attrs.helper || '').split('-')[1], 10) || 0;
                    return ai - bi;
                });

                for (let j = 0; j < savedOutputs.length && j < outputParamsArr.length; j++) {
                    const newSrcPin = outPins[j];
                    if (!newSrcPin) continue;
                    for (const { destPin, oldType } of savedOutputs[j]) {
                        addConnectionWire(destPin, newSrcPin, stage, 1, wireLayer);
                        const newType = outputParamsArr[j]?.dataType;
                        if (!isTypeCompatible(newType, destPin.attrs.pinDataType)) {
                            const inpIdx = destPin.attrs.helper ? parseInt(String(destPin.attrs.helper).split('-')[1], 10) : 0;
                            const wireToMark = destPin.getParent().customClass?.inputPins?.[inpIdx]?.wire;
                            if (wireToMark) applyMismatchToWire(wireToMark, wireLayer, stage);
                        }
                    }
                }

                for (const { srcPin } of savedExecIn) {
                    if (newCC.execInPins && newCC.execInPins[0]) {
                        const destPin = newCC.execInPins[0].thisNode;
                        addConnectionWire(destPin, srcPin, stage, 1, wireLayer);
                    }
                }

                for (let k = 0; k < savedExecOut.length && newCC.execOutPins && newCC.execOutPins[k]; k++) {
                    const { destPin } = savedExecOut[k];
                    const srcPin = newCC.execOutPins[k].thisNode;
                    addConnectionWire(destPin, srcPin, stage, 1, wireLayer);
                }
            }
        }
        if (stage) stage.draw();
    },

    rebuildReturnNode: function (node, outputParams, layer, stage, wireLayer) {
        const programNode = node;
        const grp = programNode.grp;
        const oldNd = programNode.nodeDescription;
        const oldInputs = oldNd.inputs ? Object.keys(oldNd.inputs).sort().map(k => oldNd.inputs[k]) : [];

        const savedInputs = [];
        for (let i = 0; i < programNode.inputPins.length; i++) {
            const pin = programNode.inputPins[i];
            if (pin.wire) {
                savedInputs[i] = { srcPin: pin.wire.attrs.src, oldType: oldInputs[i]?.dataType };
                deleteWire(pin.wire);
            }
        }

        const savedExecIns = [];
        for (let i = 0; i < programNode.execInPins.length; i++) {
            const ep = programNode.execInPins[i];
            if (ep.wire && ep.wire.length > 0) {
                const wireCopy = [...ep.wire];
                savedExecIns[i] = wireCopy.map(w => {
                    const srcPin = w.attrs.src;
                    deleteWire(w);
                    return srcPin;
                });
            }
        }

        const pos = grp.position();
        const grpId = grp.id();
        grp.destroy();

        const newNd = this.buildReturnDescription(outputParams);
        const newNode = new this.ProgramNode(newNd, {
            x: pos.x * stage.scaleX() + stage.x(),
            y: pos.y * stage.scaleY() + stage.y()
        }, layer, stage);
        newNode.grp.id(grpId);
        const newCC = newNode.grp.customClass;

        for (let i = 0; i < savedExecIns.length; i++) {
            if (!savedExecIns[i]) continue;
            const newExecInPin = newCC.execInPins[0]?.thisNode;
            if (newExecInPin) {
                for (const srcPin of savedExecIns[i]) {
                    addConnectionWire(newExecInPin, srcPin, stage, 1, wireLayer);
                }
            }
        }

        const outputParamsArr = outputParams || [];
        for (let i = 0; i < savedInputs.length && i < outputParamsArr.length; i++) {
            const saved = savedInputs[i];
            if (!saved) continue;
            const newDestPin = newCC.inputPins[i]?.thisNode;
            if (!newDestPin) continue;
            addConnectionWire(newDestPin, saved.srcPin, stage, 1, wireLayer);
            const newType = outputParamsArr[i]?.dataType;
            if (!isTypeCompatible(saved.srcPin.attrs.pinDataType, newType)) {
                const wire = newCC.inputPins[i].wire;
                if (wire) applyMismatchToWire(wire, wireLayer, stage);
            }
        }
        return newNode;
    },
};

/*

//required json
{
    type: string,
    id: num,
    inputs:{
        count: integer,
        execIn1:{
            name: "",
            wire: KonvaWire else null
        }
        ip1: {
            dataType: string,
            default: num/str etc,
            value: num/str etc,
            name: ""
            wire: Konva.Line else null if no wire
        }
    }
    outputs:{
        count: integer,
        execOut1:{
            name: "",
            wire: KonvaWire else null
        }
        out1: {
            dataType: string,
            default: num/str etc,
            value: num/str etc,
            name: ""
            wire: Konva.Line else null if no wire
        }
    }

}


*/
