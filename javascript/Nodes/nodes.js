import { InputBox } from '../InputBox/InputBox.js'
import { colorMap } from '../ColorMap/colorMap.js'
let placeLocation = function (location) {
    //"this" is stage
    return {
        x: (location.x - this.x()) / this.scaleX(),
        y: (location.y - this.y()) / this.scaleY()
    };
}
export var Nodes = {
    countNodes: 0,
    getExecPin: function (inType, id, layer) {
        // let pointsExecIn = [0, 0, -14, -7, -14, 7];
        // let pointsExecOut = []
        let pin = new Konva.Line({
            points: [0, 0, -14, -7, -14, 7],
            stroke: 'white',
            strokeWidth: 1,
            closed: true,
            id: id,
            name: 'pin',
            offsetX: (inType) ? -14 : 0,
            pinType: (inType) ? 'exec-in' : 'exec-out',
            pinDataType: null,
        });
        pin.on("mouseenter", () => {
            pin.strokeWidth(3);
            layer.draw();
        });
        pin.on("mouseleave", () => {
            pin.strokeWidth(1);
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
        return pin;
    },
    getRectBlock: function (height, width) {
        let rect = new Konva.Rect({
            height: height,
            width: width,
            fill: 'white',
            opacity: 0.5,
            cornerRadius: 5,

        });
        return rect;
    },
    getInputPin: function (inType, id, type, layer) {
        let pin = new Konva.Circle({
            radius: 7,
            stroke: colorMap[type],
            strokeWidth: '2',
            name: 'pin',
            pinType: (inType) ? 'inp' : 'outp',
            pinDataType: type,
            offsetX:(inType) ? -7 : 7,
            id: id,
        });
        pin.on("mouseenter", () => {
            pin.strokeWidth(3);
            layer.draw();
        });
        pin.on("mouseleave", () => {
            pin.strokeWidth(1);
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
    getLabel: function (text, size, width) {
        let rect = new Konva.Rect({
            width: width,
            height: size + 3,
            fill: 'white',
            cornerRadius: [5, 5, 0, 0]
        });
        let label = new Konva.Text({
            text: text,
            fontSize: size - 2,
            fontFamily: 'Verdana',
            fill: 'black',
            width: width,
            height: size + 3,
            align: 'center',
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
    getInputLabel: function (labelText, type) {
        let text = new Konva.Text({
            width: 40,
            height: 14,
            text: labelText,
            fontSize: 11,
            fontFamily: 'Verdana',
            fill: colorMap[type],
        });
        // text.off()
        return text;
    },
    getExecOutTitle: function (labelText) {
        let text = new Konva.Text({
            width: 60,
            height: 14,
            fontSize: 11,
            text: labelText,
            fontFamily: 'Verdana',
            fill: "white",
        });
        return text;
    },
    ProgramNode: class {
        constructor(nodeDescription, location, layer, stage) {



            this.grp = new Konva.Group({
                draggable: true,
                name: "aProgramNodeGroup",
            });
            if (nodeDescription.nodeTitle == 'Begin') {
                this.grp.id('Begin');
            }
            this.grp.customClass = this;
            // this.grp.on('dblclick', (e) => {
            //     console.table(e.currentTarget.customClass);
            // })
            let relativePosition = placeLocation.bind(stage);
            let maxOfPinsOnEitherSide = Nodes.getPinCounts(nodeDescription);
            let height = maxOfPinsOnEitherSide * 50 + 10;
            let width = nodeDescription.colums * 15;
            this.grp.position(relativePosition(location));
            let rect = Nodes.getRectBlock(height, width);
            this.grp.add(rect);
            this.grp.on("mouseenter", (e) => {
                // console.log(e);
                rect.opacity(0.55);
                layer.draw();
            });
            this.grp.on("mouseleave", (e) => {
                rect.opacity(0.5);
                layer.draw();
            })
            let titleLabel = Nodes.getLabel(nodeDescription.nodeTitle, 20, width);
            // console.log(titleLabel.width());
            this.grp.add(titleLabel.bg);
            this.grp.add(titleLabel.text);
            // titleLabel.offsetX(titleLabel.width() / 2);
            let inputPinsPlaced = 0, outputPinsPlaced = 0;
            this.execInPins = [];
            if (nodeDescription.execIn == true) {
                let execInPin = Nodes.getExecPin(true, 'exec-in-0', layer);
                execInPin.position({ x: 7, y: 44 });
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
                isFor: (nodeDescription.nodeTitle.slice(0, 3) == 'For') ? this.grp._id : 0,

            }
            this.execOutPins = [];
            if (nodeDescription.execOut) {
                Object.keys(nodeDescription.execOut).forEach((value, index) => {
                    let execOutPin = Nodes.getExecPin(false, `exec-out-${index}`, layer);
                    execOutPin.position({ x: width - 7, y: 44 + index * 39 });
                    this.grp.add(execOutPin);
                    if (nodeDescription.execOut[value].execOutTitle) {
                        let exLabel = Nodes.getExecOutTitle(nodeDescription.execOut[value].execOutTitle);
                        exLabel.position({ x: width - 84, y: 44 + index * 39 - 4 });
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
                    // iprect.position({ x: 28, y: 44 + 39 * inputPinsPlaced - 2 });
                    let iprect = null;
                    let iplabel = Nodes.getInputLabel(nodeDescription.inputs[value].inputTitle, nodeDescription.inputs[value].dataType);
                    iplabel.position({ x: 28, y: 44 + 39 * inputPinsPlaced - 4 });
                    if (nodeDescription.inputs[value].isInputBoxRequired !== false) {
                        iprect = new InputBox(stage, layer, nodeDescription.inputs[value].dataType, this.grp, { x: 28, y: 44 + 39 * inputPinsPlaced - 2 }, colorMap, inputPin, iplabel, inputPinsPlaced);
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
                    outputPin.position({ x: width - 7, y: 44 + 39 * outputPinsPlaced });
                    this.grp.add(outputPin);
                    let outLabel = Nodes.getInputLabel(nodeDescription.outputs[value].outputTitle, nodeDescription.outputs[value].dataType);
                    outLabel.position({ x: width - 65, y: 44 + 39 * outputPinsPlaced - 4 })
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
            layer.add(this.grp);
            layer.draw();
        }
    },





    CreateNode: function (type, location, layer, stage, isGetSet, dataType) {
        let nodeDescription = {};
        if (type == 'Begin') {
            nodeDescription.nodeTitle = 'Begin';
            nodeDescription.execIn = false;
            nodeDescription.execOut = {
                execOut0: {
                    execOutTitle: null,
                }
            };
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'Print') {
            nodeDescription.nodeTitle = 'Print';
            nodeDescription.execIn = true;
            nodeDescription.execOut = {
                execOut0: {
                    execOutTitle: null,
                },
            }
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'Value',
                    dataType: 'Data',
                }
            }
            nodeDescription.rows = 3;
            nodeDescription.colums = 12;
        }
        if (type == 'Branch') {
            nodeDescription.nodeTitle = 'Branch';
            nodeDescription.execIn = true;
            nodeDescription.execOut = {
                execOut0: {
                    execOutTitle: '       True',
                },
                execOut1: {
                    execOutTitle: '       False',
                }
            }
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'Bool',
                    dataType: 'Boolean',
                }
            }
            nodeDescription.rows = 3;
            nodeDescription.colums = 12;
        }
        if (type == 'Add') {
            nodeDescription.nodeTitle = 'Add';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number',
                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Number',
                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Number',
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'Modulo') {
            nodeDescription.nodeTitle = 'Modulo';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number',
                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Number',
                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Number',
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'Subtract') {
            nodeDescription.nodeTitle = 'Subtract';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number',
                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Number',
                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Number',
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'Multiply') {
            nodeDescription.nodeTitle = 'Multiply';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number',
                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Number',
                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Number',
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'Divide') {
            nodeDescription.nodeTitle = 'Divide';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number',
                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Number',
                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Number',
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'Ceil') {
            nodeDescription.nodeTitle = 'Ceil';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number',
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Number',
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'Floor') {
            nodeDescription.nodeTitle = 'Floor';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number',
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Number',
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }

        if (type == 'While') {
            nodeDescription.nodeTitle = 'While';
            nodeDescription.execIn = true;
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'Bool',
                    dataType: 'Boolean'
                },
            }
            nodeDescription.execOut = {
                execOut0: {
                    execOutTitle: 'Loop Body',
                },
                execOut1: {
                    execOutTitle: 'Completed',
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 12;
        }

        if (type == 'OR') {
            nodeDescription.nodeTitle = 'OR';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Boolean'

                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Boolean'

                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Boolean'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'AND') {
            nodeDescription.nodeTitle = 'AND';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Boolean'

                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Boolean'

                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Boolean'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'XOR') {
            nodeDescription.nodeTitle = 'XOR';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Boolean'

                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Boolean'

                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Boolean'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'bXOR') {
            nodeDescription.nodeTitle = 'bXOR';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number'

                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Number'

                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Number'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'bOR') {
            nodeDescription.nodeTitle = 'bOR';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number'

                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Number'

                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Number'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'bAND') {
            nodeDescription.nodeTitle = 'bAND';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number'

                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Number'

                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Number'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'bXOR') {
            nodeDescription.nodeTitle = 'XOR';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number'

                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Number'

                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Number'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'bNEG') {
            nodeDescription.nodeTitle = 'bNEG';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'Value',
                    dataType: 'Number',
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Number'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == "Equals") {
            nodeDescription.nodeTitle = 'Equals';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Data'

                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Data'

                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Boolean'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == "LessEq") {
            nodeDescription.nodeTitle = 'LessEq';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number'

                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Number'

                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Boolean'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == "Less") {
            nodeDescription.nodeTitle = 'Less';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number'

                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Number'

                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Boolean'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == "Greater") {
            nodeDescription.nodeTitle = 'Greater';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number'

                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Number'

                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Boolean'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == "GreaterEq") {
            nodeDescription.nodeTitle = 'GreaterEq';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'ValueA',
                    dataType: 'Number'

                },
                input1: {
                    inputTitle: 'ValueB',
                    dataType: 'Number'

                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Boolean'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'NEG') {
            nodeDescription.nodeTitle = 'NEG';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'Value',
                    dataType: 'Boolean',
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Boolean'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (isGetSet == "Set") {
            nodeDescription.nodeTitle = type;
            nodeDescription.execIn = true;
            nodeDescription.execOut = {
                execOut0: {
                    execOutTitle: null,
                },
            }
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'Value',
                    dataType: dataType,
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Value',
                    dataType: dataType,
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (isGetSet == "Get") {
            nodeDescription.nodeTitle = type;
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Value',
                    dataType: dataType,
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'Random') {
            nodeDescription.nodeTitle = 'Random';
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Rand',
                    dataType: 'Number'

                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'For') {
            nodeDescription.nodeTitle = 'For';
            nodeDescription.execIn = true;
            nodeDescription.execOut = {
                execOut0: {
                    execOutTitle: 'Loop Body',
                },
                execOut1: {
                    execOutTitle: 'Completed',
                }
            }
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'From',
                    dataType: 'Number'
                },
                input1: {
                    inputTitle: 'To(Ex)',
                    dataType: 'Number'
                },
                input2: {
                    inputTitle: 'Incr',
                    dataType: 'Number'
                }
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Index',
                    dataType: 'Number'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 12;
        }
        if (type == "Break") {
            nodeDescription.nodeTitle = 'Break';
            nodeDescription.execIn = true;
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'Length') {
            nodeDescription.nodeTitle = 'Length';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'Array',
                    dataType: 'Array',
                    isInputBoxRequired : false,
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Value',
                    dataType: 'Number'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'isEmpty') {
            nodeDescription.nodeTitle = 'isEmpty';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'Array',
                    dataType: 'Array',
                    isInputBoxRequired : false,
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Result',
                    dataType: 'Boolean'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'Front') {
            nodeDescription.nodeTitle = 'Front';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'Array',
                    dataType: 'Array',
                    isInputBoxRequired : false,
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Front',
                    dataType: 'Data'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if (type == 'Back') {
            nodeDescription.nodeTitle = 'Back';
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'Array',
                    dataType: 'Array',
                    isInputBoxRequired : false,
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Back',
                    dataType: 'Data'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if(type == 'GetByPos'){
            nodeDescription.nodeTitle = 'GetByPos';
            nodeDescription.inputs = {
                input0:{
                    inputTitle: 'Pos',
                    dataType: 'Number',
                },
                input1: {
                    inputTitle: 'Array',
                    dataType: 'Array',
                    isInputBoxRequired : false,
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Value',
                    dataType: 'Data'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if(type == 'SetByPos'){
            nodeDescription.nodeTitle = 'SetByPos';
            nodeDescription.execIn = true;
            nodeDescription.execOut = {
                execOut0: {
                    execOutTitle: null,
                },
            }
            nodeDescription.inputs = {
                input0:{
                    inputTitle: 'Pos',
                    dataType: 'Number',
                },
                input1:{
                    inputTitle: 'Value',
                    dataType: 'Data',
                },
                input2: {
                    inputTitle: 'Array',
                    dataType: 'Array',
                    isInputBoxRequired : false,
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Value',
                    dataType: 'Data'
                }
            }
            nodeDescription.rows = 4;
            nodeDescription.colums = 10;
        }
        if(type == 'Insert'){
            nodeDescription.nodeTitle = 'Insert';
            nodeDescription.execIn = true;
            nodeDescription.execOut = {
                execOut0: {
                    execOutTitle: null,
                },
            }
            nodeDescription.inputs = {
                input0:{
                    inputTitle: 'Pos',
                    dataType: 'Number',
                },
                input1:{
                    inputTitle: 'Value',
                    dataType: 'Data',
                },
                input2: {
                    inputTitle: 'Array',
                    dataType: 'Array',
                    isInputBoxRequired : false,
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Array',
                    dataType: 'Array'
                }
            }
            nodeDescription.rows = 4;
            nodeDescription.colums = 10;
        }
        if(type == 'PushBack'){
            nodeDescription.nodeTitle = 'PushBack';
            nodeDescription.execIn = true;
            nodeDescription.execOut = {
                execOut0: {
                    execOutTitle: null,
                },
            }
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'Value',
                    dataType: 'Data',
                },
                input1: {
                    inputTitle: 'Array',
                    dataType: 'Array',
                    isInputBoxRequired : false,
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Array',
                    dataType: 'Array'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if(type == 'PushFront'){
            nodeDescription.nodeTitle = 'PushFront';
            nodeDescription.execIn = true;
            nodeDescription.execOut = {
                execOut0: {
                    execOutTitle: null,
                },
            }
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'Value',
                    dataType: 'Data',
                },
                input1: {
                    inputTitle: 'Array',
                    dataType: 'Array',
                    isInputBoxRequired : false,
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Array',
                    dataType: 'Array'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if(type == 'PopBack'){
            nodeDescription.nodeTitle = 'PopBack';
            nodeDescription.execIn = true;
            nodeDescription.execOut = {
                execOut0: {
                    execOutTitle: null,
                },
            }
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'Array',
                    dataType: 'Array',
                    isInputBoxRequired : false,
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Array',
                    dataType: 'Array'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        if(type == 'PopFront'){
            nodeDescription.nodeTitle = 'PopFront';
            nodeDescription.execIn = true;
            nodeDescription.execOut = {
                execOut0: {
                    execOutTitle: null,
                },
            }
            nodeDescription.inputs = {
                input0: {
                    inputTitle: 'Array',
                    dataType: 'Array',
                    isInputBoxRequired : false,
                },
            }
            nodeDescription.outputs = {
                output0: {
                    outputTitle: ' Array',
                    dataType: 'Array'
                }
            }
            nodeDescription.rows = 2;
            nodeDescription.colums = 10;
        }
        new this.ProgramNode(nodeDescription, location, layer, stage);
    }


}



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