import { colorMap } from '../core/colorMap.js'
import { ContextMenu } from '../editor/contextMenu.js'
import { deleteNodeByGroup, deleteWire } from '../editor/deleteHandler.js'
import { showAlert, showConfirm } from './dialogs.js'

class VariableList {

    constructor() {
        this.variables = [];
        this.variablesElements = [];
        this.layer = null;
        this.stage = null;
    }

    init(layer, stage) {
        this.layer = layer;
        this.stage = stage;
    }

    getNodesForVariable(name) {
        if (!this.layer) return [];
        return this.layer.children.filter(grp =>
            grp.customClass?.type?.isGetSet &&
            grp.customClass.type.typeOfNode.slice(4) === name
        );
    }

    getWiresForNode(node) {
        const wires = [];
        for (const pin of node.customClass.inputPins) {
            if (pin.wire) wires.push(pin.wire);
        }
        for (const pin of node.customClass.outputPins) {
            if (Array.isArray(pin.wire)) wires.push(...pin.wire.filter(Boolean));
        }
        return wires;
    }

    makeContextMenuItem(variable, setOrGet) {
        let div = document.createElement("div");
        div.classList.toggle("context-menu-items", true);
        div.setAttribute('data-datatype', `${variable.dataType}`);
        div.innerHTML = `${(setOrGet == 'set') ? 'Set' : 'Get'} ${variable.name}`;
        return div;
    }

    addVariable(variable) {
        this.variables.push(variable);
        let el = this.makeLeftPanelVariableListItem(variable);
        document.getElementById("variable-list").appendChild(el);
        let set = this.makeContextMenuItem(variable, 'set');
        let get = this.makeContextMenuItem(variable, 'get');
        document.getElementById("context-menu").appendChild(get);
        document.getElementById("context-menu").appendChild(set);
        ContextMenu.addEventToCtxMenuItems(set);
        ContextMenu.addEventToCtxMenuItems(get);
        this.variablesElements.push({ name: variable.name, type: 'get', el: get });
        this.variablesElements.push({ name: variable.name, type: 'set', el: set });
    }

    makeLeftPanelVariableListItem(variable) {
        let li = document.createElement('li');
        li.id = `${variable.dataType}-${variable.name}`;
        li.classList.toggle('left-panel-variable', true);
        li.style.borderWidth = '2px';
        li.style.borderStyle = 'solid';
        li.style.boxShadow = `inset 0px 0px 5px ${colorMap[variable.dataType]}`;
        li.style.backgroundColor = 'transparent';
        li.style.borderColor = `${colorMap[variable.dataType]}`;
        li.setAttribute("draggable", "true");

        let nameSpan = document.createElement('span');
        nameSpan.classList.add('var-name-text');
        nameSpan.textContent = variable.name;
        nameSpan.style.overflow = 'hidden';
        nameSpan.style.textOverflow = 'ellipsis';
        nameSpan.style.whiteSpace = 'nowrap';
        nameSpan.style.flex = '1';
        li.appendChild(nameSpan);

        let actionsDiv = document.createElement('div');
        actionsDiv.classList.add('var-actions');

        let editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-pen"></i>';
        editBtn.title = 'Edit variable';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._showInlineEditForm(li, variable);
        });

        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('var-delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = 'Delete variable';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._confirmAndDelete(variable.name);
        });

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        li.appendChild(actionsDiv);

        li.addEventListener('mouseover', () => {
            li.style.boxShadow = `inset 0px 0px 30px ${colorMap[variable.dataType]}`;
        });
        li.addEventListener('mouseleave', () => {
            li.style.boxShadow = `inset 0px 0px 5px ${colorMap[variable.dataType]}`;
        });
        li.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("variableName", `${variable.name}`);
            e.dataTransfer.setData("dataType", `${variable.dataType}`);
        });
        return li;
    }

    // ---- DELETE FLOW ----

    _confirmAndDelete(name) {
        const nodes = this.getNodesForVariable(name);
        const count = nodes.length;
        let msg;
        if (count > 0) {
            msg = `Variable '<span style="color:#d65a31">${name}</span>' is used by <b>${count}</b> node(s) on the canvas. These nodes will be marked as orphaned. Delete anyway?`;
        } else {
            msg = `Delete variable '<span style="color:#d65a31">${name}</span>'?`;
        }
        showConfirm(msg, () => {
            this.deleteVariable(name);
        });
    }

    deleteVariable(name) {
        const nodes = this.getNodesForVariable(name);

        const idx = this.variables.findIndex(v => v.name === name);
        if (idx !== -1) this.variables.splice(idx, 1);

        const li = document.querySelector(`#variable-list .left-panel-variable[id$="-${name}"]`);
        if (li) li.remove();

        this.variablesElements = this.variablesElements.filter(item => {
            if (item.name === name) {
                item.el.remove();
                return false;
            }
            return true;
        });

        for (const grp of nodes) {
            this._applyOrphanOverlay(grp);
        }

        if (this.stage) this.stage.draw();
    }

    _applyOrphanOverlay(grp) {
        const cc = grp.customClass;
        cc.isOrphaned = true;

        const bodyRect = cc.bodyRect;
        const overlay = new Konva.Rect({
            x: bodyRect.x(),
            y: bodyRect.y(),
            width: bodyRect.width(),
            height: bodyRect.height(),
            fill: 'rgba(255, 0, 0, 0.25)',
            cornerRadius: 5,
            listening: false,
        });
        grp.add(overlay);

        const boxWidth = 120;
        const boxHeight = 36;
        const boxX = bodyRect.width() / 2 - boxWidth / 2;
        const boxY = -boxHeight - 5;

        const indicatorGrp = new Konva.Group({ x: boxX, y: boxY });

        const bg = new Konva.Rect({
            width: boxWidth,
            height: boxHeight,
            fill: 'rgba(30, 0, 0, 0.85)',
            cornerRadius: 3,
            stroke: '#f44',
            strokeWidth: 1,
        });
        indicatorGrp.add(bg);

        const label = new Konva.Text({
            text: 'Deleted Var',
            fontSize: 9,
            fontFamily: 'Verdana',
            fill: '#f88',
            width: boxWidth,
            align: 'center',
            y: 3,
        });
        indicatorGrp.add(label);

        const removeBtn = new Konva.Text({
            text: 'Remove',
            fontSize: 10,
            fontFamily: 'Verdana',
            fill: '#fff',
            width: boxWidth,
            align: 'center',
            y: 18,
        });
        removeBtn.on('mouseenter', () => {
            removeBtn.fill('#f44');
            document.body.style.cursor = 'pointer';
            this.layer.draw();
        });
        removeBtn.on('mouseleave', () => {
            removeBtn.fill('#fff');
            document.body.style.cursor = 'default';
            this.layer.draw();
        });
        removeBtn.on('click', (e) => {
            e.cancelBubble = true;
            document.body.style.cursor = 'default';
            deleteNodeByGroup(grp, this.stage);
        });
        indicatorGrp.add(removeBtn);

        grp.add(indicatorGrp);
        cc._orphanOverlay = overlay;
        cc._orphanIndicator = indicatorGrp;
    }

    // ---- EDIT FLOW ----

    _showInlineEditForm(li, variable) {
        const originalContent = li.innerHTML;
        const originalDraggable = li.getAttribute('draggable');
        li.setAttribute('draggable', 'false');
        li.innerHTML = '';
        li.style.flexDirection = 'column';
        li.style.alignItems = 'stretch';

        const form = document.createElement('div');
        form.classList.add('var-inline-edit');

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = variable.name;
        nameInput.placeholder = 'Name';

        const typeSelect = document.createElement('select');
        for (const t of ['Number', 'Boolean', 'String', 'Array']) {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            if (t === variable.dataType) opt.selected = true;
            typeSelect.appendChild(opt);
        }

        const valueInput = this._createValueInput(variable.dataType, variable.value);

        typeSelect.addEventListener('change', () => {
            const newValInput = this._createValueInput(typeSelect.value, null);
            form.replaceChild(newValInput, form.children[2]);
        });

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('var-edit-actions');

        const saveBtn = document.createElement('button');
        saveBtn.classList.add('var-edit-save');
        saveBtn.textContent = 'Save';
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newName = nameInput.value.trim();
            const newType = typeSelect.value;
            const valEl = form.children[2];
            const newValue = this._extractValue(newType, valEl);

            if (!this._validateEdit(variable.name, newName, newType, newValue)) return;

            this.editVariable(variable.name, {
                name: newName,
                dataType: newType,
                value: newValue,
            });

            variable.name = newName;
            variable.dataType = newType;
            variable.value = newValue;

            this._restoreListItem(li, variable);
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.classList.add('var-edit-cancel');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._restoreListItem(li, variable);
        });

        actionsDiv.appendChild(saveBtn);
        actionsDiv.appendChild(cancelBtn);

        form.appendChild(nameInput);
        form.appendChild(typeSelect);
        form.appendChild(valueInput);
        form.appendChild(actionsDiv);
        li.appendChild(form);
    }

    _createValueInput(dataType, currentValue) {
        if (dataType === 'Boolean') {
            const sel = document.createElement('select');
            const optT = document.createElement('option');
            optT.value = 'true'; optT.textContent = 'True';
            const optF = document.createElement('option');
            optF.value = 'false'; optF.textContent = 'False';
            sel.appendChild(optT);
            sel.appendChild(optF);
            if (currentValue === 'false') optF.selected = true;
            return sel;
        }
        const inp = document.createElement('input');
        if (dataType === 'Number') {
            inp.type = 'number';
            inp.value = currentValue != null ? currentValue : 0;
            inp.placeholder = 'Default value';
        } else if (dataType === 'String') {
            inp.type = 'text';
            let display = currentValue || '';
            if (display.startsWith("'") && display.endsWith("'")) display = display.slice(1, -1);
            inp.value = display;
            inp.placeholder = 'Default value';
        } else if (dataType === 'Array') {
            inp.type = 'text';
            inp.value = currentValue || '[]';
            inp.placeholder = '[1, 2, 3]';
        }
        return inp;
    }

    _extractValue(dataType, el) {
        const raw = el.value;
        if (dataType === 'Boolean') return raw;
        if (dataType === 'Number') return raw.toString();
        if (dataType === 'String') return `'${raw}'`;
        if (dataType === 'Array') return raw;
        return raw;
    }

    _validateEdit(oldName, newName, newType, newValue) {
        if (newName.length === 0) {
            showAlert("Variable Name Can't be empty!");
            return false;
        }
        if (newName.includes(' ')) {
            showAlert("Variable Name Can't Have Spaces");
            return false;
        }
        if (/^[0-9]/.test(newName)) {
            showAlert("Variable Name should start with an alphabet or '_'");
            return false;
        }
        if (newName !== oldName && this.variables.some(v => v.name === newName)) {
            showAlert("Variable Already Exists");
            return false;
        }
        if (newType === 'Number' && newValue.length === 0) {
            showAlert("Empty/Invalid Input");
            return false;
        }
        if (newType === 'String' && newValue === "''") {
            showAlert("Empty/Invalid Input");
            return false;
        }
        if (newType === 'Array') {
            if (newValue.length === 0 || newValue[0] !== '[' || newValue[newValue.length - 1] !== ']') {
                showAlert("Invalid Array format");
                return false;
            }
        }
        return true;
    }

    _restoreListItem(li, variable) {
        li.innerHTML = '';
        li.style.flexDirection = '';
        li.style.alignItems = '';
        li.setAttribute('draggable', 'true');
        li.id = `${variable.dataType}-${variable.name}`;
        li.style.boxShadow = `inset 0px 0px 5px ${colorMap[variable.dataType]}`;
        li.style.borderColor = `${colorMap[variable.dataType]}`;

        let nameSpan = document.createElement('span');
        nameSpan.classList.add('var-name-text');
        nameSpan.textContent = variable.name;
        nameSpan.style.overflow = 'hidden';
        nameSpan.style.textOverflow = 'ellipsis';
        nameSpan.style.whiteSpace = 'nowrap';
        nameSpan.style.flex = '1';
        li.appendChild(nameSpan);

        let actionsDiv = document.createElement('div');
        actionsDiv.classList.add('var-actions');

        let editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-pen"></i>';
        editBtn.title = 'Edit variable';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._showInlineEditForm(li, variable);
        });

        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('var-delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = 'Delete variable';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._confirmAndDelete(variable.name);
        });

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        li.appendChild(actionsDiv);

        li.addEventListener('mouseover', () => {
            li.style.boxShadow = `inset 0px 0px 30px ${colorMap[variable.dataType]}`;
        });
        li.addEventListener('mouseleave', () => {
            li.style.boxShadow = `inset 0px 0px 5px ${colorMap[variable.dataType]}`;
        });
        li.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("variableName", variable.name);
            e.dataTransfer.setData("dataType", variable.dataType);
        });
    }

    editVariable(oldName, newData) {
        const oldVar = this.variables.find(v => v.name === oldName);
        if (!oldVar) return;
        const oldType = oldVar.dataType;
        const typeChanged = oldType !== newData.dataType;
        const nameChanged = oldName !== newData.name;

        oldVar.name = newData.name;
        oldVar.dataType = newData.dataType;
        oldVar.value = newData.value;

        this.variablesElements.forEach(item => {
            if (item.name === oldName) {
                item.name = newData.name;
                const prefix = item.type === 'get' ? 'Get' : 'Set';
                item.el.innerHTML = `${prefix} ${newData.name}`;
                item.el.setAttribute('data-datatype', newData.dataType);
            }
        });

        const nodes = this.getNodesForVariable(oldName);
        for (const grp of nodes) {
            const cc = grp.customClass;
            const prefix = cc.type.typeOfNode.slice(0, 3);
            cc.type.typeOfNode = `${prefix} ${newData.name}`;
            cc.nodeDescription.nodeTitle = cc.type.typeOfNode;

            if (cc.titleText) {
                cc.titleText.text(cc.type.typeOfNode);
            }

            if (typeChanged) {
                if (cc.nodeDescription.inputs) {
                    for (const key of Object.keys(cc.nodeDescription.inputs)) {
                        cc.nodeDescription.inputs[key].dataType = newData.dataType;
                    }
                }
                if (cc.nodeDescription.outputs) {
                    for (const key of Object.keys(cc.nodeDescription.outputs)) {
                        cc.nodeDescription.outputs[key].dataType = newData.dataType;
                    }
                }

                if (cc.titleBg) {
                    cc.titleBg.fill(colorMap[newData.dataType]);
                }

                const newColor = colorMap[newData.dataType];
                const updatePin = (p) => {
                    p.stroke(newColor);
                    p.attrs.pinDataType = newData.dataType;
                    if (p.fill() && p.fill() !== '' && p.fill() !== 'transparent') {
                        p.fill(newColor);
                    }
                    p.off('wireconnected');
                    p.on('wireconnected', () => { p.fill(newColor); });
                };

                for (const pin of cc.inputPins) {
                    if (pin.thisNode) updatePin(pin.thisNode);
                }
                for (const pin of cc.outputPins) {
                    grp.find('.pin').filter(p =>
                        p.attrs.pinType === 'outp' && p.attrs.helper?.startsWith('out-')
                    ).forEach(updatePin);
                }

                this._markMismatchedWires(grp, newData.dataType);
            }
        }

        if (this.layer) this.layer.draw();
        if (this.stage) {
            const wireLayer = this.stage.findOne('#wireLayer');
            if (wireLayer) wireLayer.draw();
        }
    }

    // ---- TYPE-MISMATCH WIRE FLOW ----

    _markMismatchedWires(grp, newDataType) {
        const cc = grp.customClass;
        const wireLayer = this.stage ? this.stage.findOne('#wireLayer') : null;
        if (!wireLayer) return;

        for (const pin of cc.inputPins) {
            if (pin.wire) {
                const srcPin = pin.wire.attrs.src;
                const srcType = srcPin && srcPin.attrs.pinDataType;
                if (srcType && srcType !== 'Data' && newDataType !== 'Data' && srcType !== newDataType) {
                    this._applyMismatchToWire(pin.wire, wireLayer);
                } else {
                    this._removeMismatchFromWire(pin.wire);
                }
            }
        }

        for (const pin of cc.outputPins) {
            if (Array.isArray(pin.wire)) {
                for (const w of pin.wire) {
                    if (!w) continue;
                    const destPin = w.attrs.dest;
                    const destType = destPin && destPin.attrs.pinDataType;
                    if (destType && destType !== 'Data' && newDataType !== 'Data' && destType !== newDataType) {
                        this._applyMismatchToWire(w, wireLayer);
                    } else {
                        this._removeMismatchFromWire(w);
                    }
                }
            }
        }
    }

    _applyMismatchToWire(wire, wireLayer) {
        if (wire.isMismatched) return;
        wire.isMismatched = true;
        wire.dash([10, 5]);

        const r = 8;
        const indicatorGrp = new Konva.Group({ x: 0, y: 0 });

        const bg = new Konva.Circle({
            radius: r,
            fill: 'rgba(50, 20, 0, 0.9)',
            stroke: '#ff8800',
            strokeWidth: 1.5,
        });
        indicatorGrp.add(bg);

        const cross1 = new Konva.Line({
            points: [-4, -4, 4, 4],
            stroke: '#fff',
            strokeWidth: 2,
            lineCap: 'round',
        });
        const cross2 = new Konva.Line({
            points: [-4, 4, 4, -4],
            stroke: '#fff',
            strokeWidth: 2,
            lineCap: 'round',
        });
        indicatorGrp.add(cross1);
        indicatorGrp.add(cross2);

        const tooltip = new Konva.Label({ x: r + 4, y: -10, visible: false });
        tooltip.add(new Konva.Tag({
            fill: 'rgba(30, 10, 0, 0.9)',
            cornerRadius: 3,
            stroke: '#ff8800',
            strokeWidth: 0.5,
        }));
        tooltip.add(new Konva.Text({
            text: 'Type Mismatch',
            fontSize: 10,
            fontFamily: 'Verdana',
            fill: '#ffaa44',
            padding: 4,
        }));
        indicatorGrp.add(tooltip);

        indicatorGrp.on('mouseenter', () => {
            bg.fill('#ff4400');
            cross1.stroke('#fff');
            cross2.stroke('#fff');
            tooltip.visible(true);
            document.body.style.cursor = 'pointer';
            wireLayer.draw();
        });
        indicatorGrp.on('mouseleave', () => {
            bg.fill('rgba(50, 20, 0, 0.9)');
            tooltip.visible(false);
            document.body.style.cursor = 'default';
            wireLayer.draw();
        });
        indicatorGrp.on('click', (e) => {
            e.cancelBubble = true;
            document.body.style.cursor = 'default';
            indicatorGrp.destroy();
            deleteWire(wire);
            if (this.stage) this.stage.draw();
        });

        const updatePosition = () => {
            const pts = wire.points();
            if (pts.length >= 4) {
                indicatorGrp.x((pts[0] + pts[pts.length - 2]) / 2);
                indicatorGrp.y((pts[1] + pts[pts.length - 1]) / 2);
            }
        };
        updatePosition();

        const srcNode = wire.attrs.src?.getParent();
        const destNode = wire.attrs.dest?.getParent();
        if (srcNode) srcNode.on('dragmove.mismatch', updatePosition);
        if (destNode) destNode.on('dragmove.mismatch', updatePosition);
        wire._mismatchDragCleanup = () => {
            if (srcNode) srcNode.off('dragmove.mismatch');
            if (destNode) destNode.off('dragmove.mismatch');
        };

        wireLayer.add(indicatorGrp);
        wire._mismatchIndicator = indicatorGrp;
    }

    _removeMismatchFromWire(wire) {
        if (!wire.isMismatched) return;
        wire.isMismatched = false;
        wire.dash([]);
        if (wire._mismatchDragCleanup) {
            wire._mismatchDragCleanup();
            wire._mismatchDragCleanup = null;
        }
        if (wire._mismatchIndicator) {
            wire._mismatchIndicator.destroy();
            wire._mismatchIndicator = null;
        }
    }

    deleteAllVariables() {
        this.variables = [];
        document.getElementById("variable-list").innerHTML = '';
        this.variablesElements.forEach((item) => {
            item.el.remove();
        });
        this.variablesElements = [];
    }
}

export var variableList = new VariableList();
