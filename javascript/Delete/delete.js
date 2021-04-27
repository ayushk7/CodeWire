
export var Delete = {
    enableDelete: function (stage, layer) {
        let ctrlIsPressed = false;
        stage.on("click", (e) => {
            // console.log(e.target.getParent());
            if (e.target.name() == "isConnection" && ctrlIsPressed) {
                let aWire = e.target;
                deleteWire(aWire);
                layer.draw();
            }
            else if(e.target !== stage && e.target.getParent().name() == "aProgramNodeGroup" && ctrlIsPressed)
            {
                // console.log(e);
                let node = e.target.getParent();
                for(let each of node.customClass.execInPins)
                {
                    let len = each.wire.length;
                    for(let i=0; i<len; i++)
                    {
                        if(each.wire[0])
                            {deleteWire(each.wire[0]);}
                    }
                }
                for(let each of node.customClass.execOutPins)
                {
                    if(each.wire)
                    {
                        deleteWire(each.wire);
                        each.wire = null;
                    }
                }
                for(let each of node.customClass.inputPins)
                {
                    if(each.wire)
                    {
                        deleteWire(each.wire);
                        each.wire = null;
                    }
                }
                for(let each of node.customClass.outputPins)
                {
                    let len = each.wire.length;
                    for(let i=0; i<len; i++)
                    {
                        if(each.wire[0])
                            {deleteWire(each.wire[0]);}
                    }
                }
                e.target.getParent().destroy();
                layer.draw();
            }
        });
        stage.container().addEventListener("keydown", (e) => {
            e.preventDefault();
            if (e.code == "ControlLeft" && !ctrlIsPressed) {
                ctrlIsPressed = true;
                let X = layer.find(".isConnection");
                X.forEach(wire => {
                    wire.strokeWidth(5);
                    wire.hitStrokeWidth(10);
                });
                // layer.toggleHitCanvas();
                layer.draw();
            }
        });
        stage.container().addEventListener("keyup", (e) => {
            e.preventDefault();
            if (e.code == "ControlLeft") {
                let X = layer.find(".isConnection");
                X.forEach(wire => {
                    wire.hitStrokeWidth(0);
                    wire.strokeWidth(2);
                });
                // layer.toggleHitCanvas();
                layer.draw();
                ctrlIsPressed = false;
            }
        })
    }
}
export function deleteWire(aWire) {
    let lineClone = aWire;
    // console.log(lineClone);
    if (lineClone.attrs.src.attrs.pinType == 'exec-out') {
        let tmpA = lineClone.attrs.src.id().split('-');
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
        let tmpA = lineClone.attrs.src.id().split('-');
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
        let tmpA = lineClone.attrs.dest.id().split('-');
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
    lineClone.destroy();
}

