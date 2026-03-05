
export var Delete = {
    enableDelete: function (stage, layer) {
    }
}
export function deleteProgramNode(e, layer, stage) {
    let node = e.target.getParent();
    if (node.customClass && node.customClass.isDeletable === false) return;
    deleteNodeByGroup(node, stage);
}

export function deleteNodeByGroup(node, stage) {
    for (let each of node.customClass.execInPins) {
        let len = each.wire.length;
        for (let i = 0; i < len; i++) {
            if (each.wire[0]) { deleteWire(each.wire[0]); }
        }
    }
    for (let each of node.customClass.execOutPins) {
        if (each.wire) {
            deleteWire(each.wire);
            each.wire = null;
        }
    }
    for (let each of node.customClass.inputPins) {
        if (each.wire) {
            deleteWire(each.wire);
            each.wire = null;
        }
    }
    for (let each of node.customClass.outputPins) {
        let len = each.wire.length;
        for (let i = 0; i < len; i++) {
            if (each.wire[0]) { deleteWire(each.wire[0]); }
        }
    }
    node.destroy();
    stage.draw();
}

export function deleteWire(aWire) {
    let lineClone = aWire;
    // console.log(lineClone);
    if (lineClone.attrs.src.attrs.pinType == 'exec-out') {
        let tmpA = lineClone.attrs.src.attrs.helper.split('-');
        lineClone.attrs.src.getParent().customClass.execOutPins[parseInt(tmpA[tmpA.length - 1])].wire = null;
        lineClone.attrs.src.fire(
            'wireremoved',
            {
                type: 'wireremoved',
                target: lineClone.attrs.src,
                isPinEmpty: true,
            }
        );
    }
    if (lineClone.attrs.src.attrs.pinType == 'outp') {
        let tmpA = lineClone.attrs.src.attrs.helper.split('-');
        lineClone.attrs.src.getParent().customClass.outputPins[parseInt(tmpA[tmpA.length - 1])].wire.forEach((value, index) => {
            if (value == lineClone) {
                lineClone.attrs.src.getParent().customClass.outputPins[parseInt(tmpA[tmpA.length - 1])].wire.splice(index, 1);
            }
        });
        lineClone.attrs.src.fire(
            'wireremoved',
            {
                type: 'wireremoved',
                target: lineClone.attrs.src,
                isPinEmpty: (lineClone.attrs.src.getParent().customClass.outputPins[parseInt(tmpA[tmpA.length - 1])].wire.length == 0),
            }
        );

    }
    if (lineClone.attrs.dest.attrs.pinType == 'exec-in') {
        lineClone.attrs.dest.getParent().customClass.execInPins[0].wire.forEach((value, index) => {
            if (value == lineClone) {
                // console.log("req", value);
                lineClone.attrs.dest.getParent().customClass.execInPins[0].wire.splice(index, 1);
            }
        });
        lineClone.attrs.dest.fire(
            'wireremoved',
            {
                type: 'wireremoved',
                target: lineClone.attrs.dest,
                isPinEmpty: (lineClone.attrs.dest.getParent().customClass.execInPins[0].wire.length == 0),
            }
        );
    }
    if (lineClone.attrs.dest.attrs.pinType == 'inp') {
        let tmpA = lineClone.attrs.dest.attrs.helper.split('-');
        lineClone.attrs.dest.getParent().customClass.inputPins[parseInt(tmpA[tmpA.length - 1])].wire = null;
        lineClone.attrs.dest.fire(
            'wireremoved',
            {
                type: 'wireremoved',
                target: lineClone.attrs.dest,
                isPinEmpty: true,
            }
        );
    }
    if (lineClone._mismatchDragCleanup) {
        lineClone._mismatchDragCleanup();
        lineClone._mismatchDragCleanup = null;
    }
    if (lineClone._mismatchIndicator) {
        lineClone._mismatchIndicator.destroy();
        lineClone._mismatchIndicator = null;
    }
    if (lineClone._closeDragCleanup) {
        lineClone._closeDragCleanup();
        lineClone._closeDragCleanup = null;
    }
    if (lineClone._closeIndicator) {
        lineClone._closeIndicator.destroy();
        lineClone._closeIndicator = null;
    }
    lineClone.destroy();
    
}
export function deleteHalfWire(lineClone, originPreOccupied) {

    lineClone.attrs.wireOrigin.fire(
        'wireremoved',
        {
            type: 'wireremoved',
            target: lineClone.attrs.wireOrigin,
            isPinEmpty: !originPreOccupied,
        }
    );
    lineClone.destroy();
}

