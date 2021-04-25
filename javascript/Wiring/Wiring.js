
// import {DragAndDrop} from '../DragAndDrop/DragAndDrop.js'
export var Wiring = {
    placeLocation: function (location, stage) {
        return {
            x: (location.x - stage.x()) / stage.scaleX(),
            y: (location.y - stage.y()) / stage.scaleY()
        };
    },
    enableWiring: function (stage, layer) {
        let currentPinType = null;
        let currentPinDataType = null;
        function isValidMatch(pinType, targetPinDataType){
            if((currentPinType == 'exec-out' && pinType == 'exec-in') || (currentPinType == 'exec-in' && pinType == 'exec-out'))
                return true;
            if((currentPinType == 'outp' && pinType == 'inp') || (currentPinType == 'inp' && pinType == 'outp'))
            {
                if(currentPinDataType == targetPinDataType || targetPinDataType == 'Data' || currentPinDataType == 'Data')
                    return true;
            }
            return false;
        }
        let isWiring = false;
        let src = null;
        let target = null;
        let templayer2 = new Konva.Layer();
        let wire = null;
        let potentialTarget = null;
        let dir = 0;
        let wireColor = null;
        stage.add(templayer2);
        stage.on('mousedown', (e) => {
            if (e.target.name() == 'pin' && e.evt.button == 0) {
                src = e.target;
                // console.log("clicked " + src.attrs.pinType);
                currentPinType = e.target.attrs.pinType;
                currentPinDataType = e.target.attrs.pinDataType;
                dir = (currentPinType == 'exec-out' || currentPinType == 'outp') ? 1: -1;
                src.getParent().draggable(false);
                isWiring = true;
                // console.log(src.x(), src.y());
                let srcLoc = this.placeLocation(src.getAbsolutePosition(), stage);
                let destLoc = this.placeLocation(stage.getPointerPosition(), stage);
                let len = (destLoc.x - srcLoc.x) / 2;
                len = dir * Math.abs(len);
                let mid1 = {
                    x: srcLoc.x + len,
                    y: srcLoc.y
                }
                let mid2 = {
                    x: destLoc.x - len,
                    y: destLoc.y
                }
                wireColor = e.target.attrs.stroke;
                wire = new Konva.Line({
                    points: [srcLoc.x, srcLoc.y, mid1.x, mid1.y, mid2.x, mid2.y, destLoc.x, destLoc.y],
                    strokeWidth: 2,
                    stroke: wireColor,
                    hitStrokeWidth: 0,
                    src: null,
                    dest: null,
                    // tension: 0.4,
                    bezier: true,
                    // zIndex: -1
                    // fill: 'red'
                })
                // wire.off('mouseover');
                templayer2.add(wire);
                // wire.zIndex();
                templayer2.draw();
                // console.log(wire);
            }
        });
        stage.on('mouseup', (e) => {
            // console.table(e);
            if (src && src.name() == 'pin' && e.evt.button == 0) {
                if (potentialTarget) {

                    target = potentialTarget;
                    let srcLoc = this.placeLocation(src.getAbsolutePosition(), stage);
                    let destLoc = this.placeLocation(potentialTarget.getAbsolutePosition(), stage);
                    let len = (destLoc.x - srcLoc.x) / 2 ;
                    len = dir * Math.abs(len);
                    let mid1 = {
                        x: srcLoc.x + len,
                        y: srcLoc.y
                    }
                    let mid2 = {
                        x: destLoc.x - len,
                        y: destLoc.y
                    }
                    wire.points([srcLoc.x, srcLoc.y, mid1.x, mid1.y, mid2.x, mid2.y, destLoc.x, destLoc.y]);
                    // wire.hitStrokeWidth(10);
                    wire.setAttr('src', src);
                    wire.setAttr('dest', target);
                    let lineClone = wire.clone();
                    layer.add(lineClone);
                    if(lineClone.attrs.dest.attrs.pinType == 'exec-out' || lineClone.attrs.dest.attrs.pinType == 'outp')
                    {
                        let tmp = lineClone.attrs.src;
                        lineClone.attrs.src = lineClone.attrs.dest;
                        lineClone.attrs.dest = tmp;
                    }
                    if(lineClone.attrs.src.attrs.pinType == 'exec-out')
                    {
                        let tmpA = lineClone.attrs.src.id().split('-');
                        removePreviousWireIfExistOfExecOutType(lineClone, tmpA);
                        lineClone.attrs.src.getParent().customClass.execOutPins[parseInt(tmpA[tmpA.length - 1])].wire = lineClone;
                    }
                    if(lineClone.attrs.src.attrs.pinType == 'outp')
                    {
                        let tmpA = lineClone.attrs.src.id().split('-');
                        lineClone.attrs.src.getParent().customClass.outputPins[parseInt(tmpA[tmpA.length - 1])].wire.push(lineClone);
                    }
                    if(lineClone.attrs.dest.attrs.pinType == 'exec-in')
                    {
                        lineClone.attrs.dest.getParent().customClass.execInPins[0].wire.push(lineClone);
                    }
                    if(lineClone.attrs.dest.attrs.pinType == 'inp')
                    {
                        let tmpA = lineClone.attrs.dest.id().split('-');
                        removePreviousWireIfExistOfOutputType(lineClone, tmpA);
                        lineClone.attrs.dest.getParent().customClass.inputPins[parseInt(tmpA[tmpA.length - 1])].wire = lineClone;
                    }
                    wireColorCorrection(lineClone);
                    fillPins(lineClone);
                    lineClone.attrs.src.getParent().on('dragmove', (e)=>{
                        let sLoc = this.placeLocation(lineClone.attrs.src.getAbsolutePosition(), stage);
                        let dLoc = this.placeLocation(lineClone.attrs.dest.getAbsolutePosition(), stage);
                        let len = (dLoc.x - sLoc.x) / 2 ;
                        len = Math.abs(len);
                        let mmid1 = {
                            x: sLoc.x + len,
                            y: sLoc.y
                        }
                        let mmid2 = {
                            x: dLoc.x - len,
                            y: dLoc.y
                        }
                        lineClone.points([sLoc.x, sLoc.y, mmid1.x, mmid1.y, mmid2.x, mmid2.y, dLoc.x, dLoc.y]);
                        layer.draw();
                    });
                    lineClone.attrs.dest.getParent().on('dragmove', (e)=>{
                        let sLoc = this.placeLocation(lineClone.attrs.src.getAbsolutePosition(), stage);
                        let dLoc = this.placeLocation(lineClone.attrs.dest.getAbsolutePosition(), stage);
                        let len = (dLoc.x - sLoc.x) / 2 ;
                        len = Math.abs(len);
                        let mmid1 = {
                            x: sLoc.x + len,
                            y: sLoc.y
                        }
                        let mmid2 = {
                            x: dLoc.x - len,
                            y: dLoc.y
                        }
                        lineClone.points([sLoc.x, sLoc.y, mmid1.x, mmid1.y, mmid2.x, mmid2.y, dLoc.x, dLoc.y]);
                        layer.draw();
                    });
                    lineClone.attrs.dest.fire(
                        'wireconnected',
                        {
                            type: 'wireconnected',
                            target: lineClone.attrs.dest,
                        }
                    )
                    lineClone.attrs.src.fire(
                        'wireconnected',
                        {
                            type: 'wireconnected',
                            target: lineClone.attrs.src,
                        }
                    )


                    layer.draw();
                }
                src.getParent().draggable(true);
                src = null;
                isWiring = false;
                wire.destroy();
                dir = 0;
                wire = null;
                currentPinType = null;
                currentPinDataType = null;
                wireColor = null;
                templayer2.draw();
                // console.log(isWiring);
            }
        });
        stage.on('mouseover', (e) => {
            if (e.target && src && e.target.name() == 'pin' && src != e.target && src.getParent() !== e.target.getParent() && isValidMatch(e.target.attrs.pinType, e.target.attrs.pinDataType)) {
                potentialTarget = e.target;
                let srcLoc = this.placeLocation(src.getAbsolutePosition(), stage);
                let destLoc = this.placeLocation(stage.getPointerPosition(), stage);
                let len = (destLoc.x - srcLoc.x) / 2 ;
                len = dir * Math.abs(len);
                let mid1 = {
                    x: srcLoc.x + len,
                    y: srcLoc.y
                }
                let mid2 = {
                    x: destLoc.x - len,
                    y: destLoc.y
                }
                wire.points([srcLoc.x, srcLoc.y, mid1.x, mid1.y, mid2.x, mid2.y, destLoc.x, destLoc.y]);
                templayer2.draw();
            }
            else potentialTarget = null;
        });
        stage.on('mousemove', (e) => {
            if (isWiring) {
                let srcLoc = this.placeLocation(src.getAbsolutePosition(), stage);
                let destLoc = this.placeLocation(stage.getPointerPosition(), stage);
                let len = (destLoc.x - srcLoc.x) / 2 ;
                len = dir * Math.abs(len);
                let mid1 = {
                    x: srcLoc.x + len,
                    y: srcLoc.y
                }
                let mid2 = {
                    x: destLoc.x - len,
                    y: destLoc.y
                }
                wire.points([srcLoc.x, srcLoc.y, mid1.x, mid1.y, mid2.x, mid2.y, destLoc.x, destLoc.y]);
                templayer2.draw();
            }
        })
        // stage.on('dragmove', )

    }

}
const colorMap = {
    'Number': '#00ffff',
    'String': '#aaff00',
    'Boolean': '#e60000', 
    'Data': '#ffb3ff'
};
function wireColorCorrection(lineClone) {
    let srcColor = lineClone.attrs.src.attrs.stroke;
    let destColor = lineClone.attrs.dest.attrs.stroke;
    if (srcColor != destColor) {
        if (srcColor != colorMap['Data']) {
            lineClone.attrs.stroke = srcColor;
        }
        else {
            lineClone.attrs.stroke = destColor;
        }
    }
}

function fillPins(lineClone) {
    let srcPinType = lineClone.attrs.src.attrs.pinType;
    let destPinType = lineClone.attrs.src.attrs.pinType;
    if (srcPinType == 'exec-in' || srcPinType == 'exec-out') {
        lineClone.attrs.src.attrs.fill = 'white';
    }
    else {
        lineClone.attrs.src.attrs.fill = lineClone.attrs.src.attrs.stroke;
    }
    if (destPinType == 'exec-in' || destPinType == 'exec-out') {
        lineClone.attrs.dest.attrs.fill = 'white';
    }
    else {
        lineClone.attrs.dest.attrs.fill = lineClone.attrs.dest.attrs.stroke;
    }

}

function removePreviousWireIfExistOfOutputType(lineClone, tmpA) {
    if (lineClone.attrs.dest.getParent().customClass.inputPins[parseInt(tmpA[tmpA.length - 1])].wire) {
        let wireToBeRemoved = lineClone.attrs.dest.getParent().customClass.inputPins[parseInt(tmpA[tmpA.length - 1])].wire;
        let tmpB = wireToBeRemoved.attrs.src.id().split('-');
        wireToBeRemoved.attrs.src.getParent().customClass.outputPins[parseInt(tmpB[tmpB.length - 1])].wire = wireToBeRemoved.attrs.src.getParent().customClass.outputPins[tmpB[tmpB.length - 1]].wire.filter(value => value !== wireToBeRemoved);
        wireToBeRemoved.attrs.src.attrs.fill = (wireToBeRemoved.attrs.src.getParent().customClass.outputPins[parseInt(tmpB[tmpB.length - 1])].wire.length != 0) ? wireToBeRemoved.attrs.src.attrs.fill  : '';
        wireToBeRemoved.destroy();
    }
}

function removePreviousWireIfExistOfExecOutType(lineClone, tmpA) {
    if (lineClone.attrs.src.getParent().customClass.execOutPins[parseInt(tmpA[tmpA.length - 1])].wire != null) {
        let wireToBeRemoved = lineClone.attrs.src.getParent().customClass.execOutPins[parseInt(tmpA[tmpA.length - 1])].wire;
        wireToBeRemoved.attrs.dest.getParent().customClass.execInPins[0].wire = wireToBeRemoved.attrs.dest.getParent().customClass.execInPins[0].wire.filter(value => value !== wireToBeRemoved);
        wireToBeRemoved.attrs.dest.attrs.fill = (wireToBeRemoved.attrs.dest.getParent().customClass.execInPins[0].wire.length != 0) ? wireToBeRemoved.attrs.dest.attrs.fill: '';
        wireToBeRemoved.destroy();
    }
}
