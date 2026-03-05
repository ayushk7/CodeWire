import { colorMap } from '../core/colorMap.js';
import { tabManager, isValidFunctionName } from '../editor/tabManager.js';
import { applyOrphanOverlay } from '../editor/orphanOverlay.js';
import { showAlert } from './dialogs.js';
import { Nodes } from '../nodes/nodeFactory.js';
import { showDocTooltip, hideDocTooltip } from '../utils/docTooltip.js';

const DATA_TYPES = ['Number', 'Boolean', 'String', 'Array'];

function createDefaultValueInput(dataType, currentValue) {
    if (dataType === 'Boolean') {
        const sel = document.createElement('select');
        sel.className = 'param-def-value';
        const optT = document.createElement('option');
        optT.value = 'true';
        optT.textContent = 'True';
        const optF = document.createElement('option');
        optF.value = 'false';
        optF.textContent = 'False';
        sel.appendChild(optT);
        sel.appendChild(optF);
        if (currentValue === 'false') optF.selected = true;
        return sel;
    }
    const inp = document.createElement('input');
    inp.className = 'param-def-value';
    inp.type = dataType === 'Number' ? 'number' : 'text';
    if (dataType === 'Number') inp.value = currentValue != null ? currentValue : 0;
    else if (dataType === 'String') {
        let display = currentValue != null ? currentValue : '';
        if (typeof display === 'string' && display.startsWith("'") && display.endsWith("'")) display = display.slice(1, -1);
        inp.value = display;
    } else if (dataType === 'Array') inp.value = currentValue || '[]';
    inp.placeholder = dataType === 'Array' ? '[1, 2, 3]' : 'Default value';
    return inp;
}

function extractDefValue(dataType, el) {
    const raw = el.value;
    if (dataType === 'Boolean') return raw === 'true';
    if (dataType === 'Number') return raw.toString();
    if (dataType === 'String') return `'${raw}'`;
    if (dataType === 'Array') return raw;
    return raw;
}

function buildParamForm(sectionId, onAdd, options = {}) {
    const { includeDefaultValue: includeDef = false } = options;
    const content = document.getElementById(sectionId);
    if (!content) return;
    content.innerHTML = '';

    const sectionInner = document.createElement('div');
    sectionInner.className = 'left-panel-section-inner';

    const form = document.createElement('div');
    form.className = 'var-inline-edit';

    const typeSelect = document.createElement('select');
    for (const t of DATA_TYPES) {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        typeSelect.appendChild(opt);
    }

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Name';

    const defValueContainer = document.createElement('div');
    defValueContainer.className = 'param-def-value-container';
    let defValueEl = null;
    if (includeDef) {
        defValueEl = createDefaultValueInput(typeSelect.value, null);
        defValueContainer.appendChild(defValueEl);
        typeSelect.addEventListener('change', () => {
            defValueContainer.innerHTML = '';
            defValueEl = createDefaultValueInput(typeSelect.value);
            defValueContainer.appendChild(defValueEl);
        });
    }

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('var-edit-actions');
    const addBtn = document.createElement('button');
    addBtn.classList.add('var-edit-save');
    addBtn.textContent = 'Add';
    addBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const dataType = typeSelect.value;
        if (!name) { showAlert("Parameter name can't be empty!"); return; }
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
            showAlert("Parameter name must be a valid identifier"); return;
        }
        const param = { name, dataType };
        if (includeDef && defValueEl) {
            param.defValue = extractDefValue(dataType, defValueEl);
        }
        onAdd(param);
        nameInput.value = '';
        if (includeDef && defValueEl) {
            defValueContainer.innerHTML = '';
            defValueEl = createDefaultValueInput(typeSelect.value, null);
            defValueContainer.appendChild(defValueEl);
        }
    });
    actionsDiv.appendChild(addBtn);

    form.appendChild(typeSelect);
    form.appendChild(nameInput);
    if (includeDef) form.appendChild(defValueContainer);
    form.appendChild(actionsDiv);
    sectionInner.appendChild(form);

    const listEl = document.createElement('ul');
    listEl.className = 'param-list';
    sectionInner.appendChild(listEl);
    content.appendChild(sectionInner);

    return listEl;
}

function renderParamList(listEl, params, onRemove, onEdit) {
    listEl.innerHTML = '';
    params.forEach((param, idx) => {
        const li = document.createElement('li');
        li.className = 'left-panel-variable';
        li.style.borderWidth = '2px';
        li.style.borderStyle = 'solid';
        li.style.borderColor = colorMap[param.dataType] || '#fff';
        li.style.boxShadow = `inset 0px 0px 5px ${colorMap[param.dataType] || '#fff'}`;
        li.style.backgroundColor = 'transparent';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'var-name-text';
        nameSpan.textContent = param.name;
        nameSpan.style.overflow = 'hidden';
        nameSpan.style.textOverflow = 'ellipsis';
        nameSpan.style.whiteSpace = 'nowrap';
        nameSpan.style.flex = '1';
        li.appendChild(nameSpan);

        const typeSpan = document.createElement('span');
        typeSpan.style.fontSize = '0.85rem';
        typeSpan.style.opacity = '0.6';
        typeSpan.style.marginLeft = '0.3rem';
        typeSpan.textContent = param.dataType;
        li.appendChild(typeSpan);

        if (param.defValue != null && param.defValue !== '') {
            const defSpan = document.createElement('span');
            defSpan.style.fontSize = '0.75rem';
            defSpan.style.opacity = '0.5';
            defSpan.style.marginLeft = '0.3rem';
            const display = typeof param.defValue === 'string' && param.defValue.startsWith("'") && param.defValue.endsWith("'")
                ? param.defValue.slice(1, -1) : String(param.defValue);
            defSpan.textContent = `= ${display}`;
            defSpan.title = 'Default value';
            li.appendChild(defSpan);
        }

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('var-actions');

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('var-delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = 'Remove parameter';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onRemove(idx);
        });
        actionsDiv.appendChild(deleteBtn);
        li.appendChild(actionsDiv);

        li.addEventListener('mouseover', () => {
            li.style.boxShadow = `inset 0px 0px 30px ${colorMap[param.dataType] || '#fff'}`;
        });
        li.addEventListener('mouseleave', () => {
            li.style.boxShadow = `inset 0px 0px 5px ${colorMap[param.dataType] || '#fff'}`;
        });

        listEl.appendChild(li);
    });
}

let inputListEl = null;
let outputListEl = null;

function refreshInputList() {
    const tab = tabManager.getActiveTab();
    if (!tab || tab.type !== 'function' || !inputListEl) return;
    renderParamList(inputListEl, tab.inputParams, (idx) => {
        tab.inputParams.splice(idx, 1);
        refreshInputList();
        tabManager._emit('functionParamsChanged', { tab, paramType: 'input' });
    });
}

function refreshOutputList() {
    const tab = tabManager.getActiveTab();
    if (!tab || tab.type !== 'function' || !outputListEl) return;
    renderParamList(outputListEl, tab.outputParams, (idx) => {
        tab.outputParams.splice(idx, 1);
        refreshOutputList();
        tabManager._emit('functionParamsChanged', { tab, paramType: 'output' });
    });
}

export function initFunctionPanel() {
    document.getElementById('input-params').addEventListener('click', () => {
        document.getElementById('input-params-content').classList.toggle('hidden');
        document.getElementById('input-params-arrow').classList.toggle('left-panel-tab-arrow-up');
    });

    document.getElementById('output-params').addEventListener('click', () => {
        document.getElementById('output-params-content').classList.toggle('hidden');
        document.getElementById('output-params-arrow').classList.toggle('left-panel-tab-arrow-up');
    });

    document.getElementById('doc-string').addEventListener('click', () => {
        document.getElementById('doc-string-content').classList.toggle('hidden');
        document.getElementById('doc-string-arrow').classList.toggle('left-panel-tab-arrow-up');
    });

    const docStringInput = document.getElementById('doc-string-input');
    if (docStringInput) {
        docStringInput.addEventListener('input', () => {
            const tab = tabManager.getActiveTab();
            if (!tab || tab.type !== 'function') return;
            tab.docString = docStringInput.value.trim();
            Nodes.updateCallNodesDocString(tab.name, tab.docString);
            tabManager._emit('functionDocChanged', { tab });
        });
    }

    const updateCallersBtn = document.getElementById('update-callers-btn');
    if (updateCallersBtn) {
        updateCallersBtn.addEventListener('click', () => {
            const tab = tabManager.getActiveTab();
            if (!tab || tab.type !== 'function') return;
            Nodes.updateCallNodesToDefinition(tab.name, tab.inputParams, tab.outputParams, tab.docString || '');
        });
    }

    document.getElementById('list-of-functions').addEventListener('click', () => {
        document.getElementById('list-of-functions-content').classList.toggle('hidden');
        document.getElementById('list-of-functions-down-icon').classList.toggle('left-panel-tab-arrow-up');
    });

    inputListEl = buildParamForm('input-params-content', (param) => {
        const tab = tabManager.getActiveTab();
        if (!tab || tab.type !== 'function') return;
        if (tab.inputParams.some(p => p.name === param.name)) {
            showAlert('Input parameter already exists'); return;
        }
        tab.inputParams.push(param);
        refreshInputList();
        tabManager._emit('functionParamsChanged', { tab, paramType: 'input' });
    }, { includeDefaultValue: true });

    outputListEl = buildParamForm('output-params-content', (param) => {
        const tab = tabManager.getActiveTab();
        if (!tab || tab.type !== 'function') return;
        if (tab.outputParams.some(p => p.name === param.name)) {
            showAlert('Output parameter already exists'); return;
        }
        tab.outputParams.push(param);
        refreshOutputList();
        tabManager._emit('functionParamsChanged', { tab, paramType: 'output' });
    });

    tabManager.on('tabSwitched', ({ to }) => {
        updatePanelVisibility(to);
    });

    tabManager.on('tabCreated', (tab) => {
        updatePanelVisibility(tab);
        if (tab.type === 'function' && !tabManager._suppressAutoNodes) {
            createFunctionNodes(tab);
        }
        refreshFunctionsList();
        refreshContextMenuFunctions();
    });

    tabManager.on('tabClosed', (tab) => {
        if (tab && tab.type === 'function') {
            const stage = tabManager.getStage();
            const remainingTabs = tabManager.getAllTabs();
            for (const t of remainingTabs) {
                const layer = t.layer;
                if (!layer) continue;
                layer.find('.aProgramNodeGroup').forEach((grp) => {
                    const cc = grp.customClass;
                    if (!cc || !cc.nodeDescription || !cc.nodeDescription.isCallFunction || cc.nodeDescription.calledFunctionName !== tab.name) return;
                    if (cc.isOrphaned) return;
                    applyOrphanOverlay(grp, layer, stage, 'Deleted Func');
                });
            }
            if (stage) stage.draw();
        }
        refreshFunctionsList();
        refreshContextMenuFunctions();
    });

    tabManager.on('tabRenamed', () => {
        refreshFunctionsList();
        refreshContextMenuFunctions();
    });

    tabManager.on('functionParamsChanged', ({ tab, paramType }) => {
        syncFunctionNodes(tab, paramType);
        Nodes.updateCallNodesToDefinition(tab.name, tab.inputParams, tab.outputParams, tab.docString || '');
        refreshFunctionsList();
        refreshContextMenuFunctions();
    });

    tabManager.on('functionDocChanged', () => {
        refreshFunctionsList();
    });
}

function createFunctionNodes(tab) {
    const stage = tabManager.getStage();
    const containerRect = stage.container().getBoundingClientRect();
    const beginX = containerRect.width * 0.2;
    const beginY = containerRect.height * 0.3;
    const returnX = containerRect.width * 0.7;
    const returnY = containerRect.height * 0.3;

    const beginNode = Nodes.CreateFunctionBeginNode(
        tab.inputParams, { x: beginX, y: beginY }, tab.layer, stage
    );
    tab.beginNodeId = beginNode.grp.id();

    const returnNode = Nodes.CreateReturnNode(
        tab.outputParams, { x: returnX, y: returnY }, tab.layer, stage
    );
    tab.returnNodeId = returnNode.grp.id();
}

function syncFunctionNodes(tab, paramType) {
    const stage = tabManager.getStage();
    const wireLayer = tab.wireLayer;

    if (paramType === 'input') {
        const beginGrp = tab.layer.findOne('#FunctionBegin') || tab.layer.findOne(`#${tab.beginNodeId}`);
        if (beginGrp && beginGrp.customClass) {
            const newNode = Nodes.rebuildFunctionBeginNode(beginGrp.customClass, tab.inputParams, tab.layer, stage, wireLayer);
            tab.beginNodeId = newNode.grp.id();
        }
    } else if (paramType === 'output') {
        const returnGrp = tab.layer.findOne('#Return') || tab.layer.findOne(`#${tab.returnNodeId}`);
        if (returnGrp && returnGrp.customClass) {
            const newNode = Nodes.rebuildReturnNode(returnGrp.customClass, tab.outputParams, tab.layer, stage, wireLayer);
            tab.returnNodeId = newNode.grp.id();
        }
    }
}

function updatePanelVisibility(tab) {
    const inputSection = document.getElementById('input-params-section');
    const outputSection = document.getElementById('output-params-section');
    const docSection = document.getElementById('doc-string-section');
    const docStringInput = document.getElementById('doc-string-input');
    const updateCallersSection = document.getElementById('update-callers-section');

    if (tab.type === 'function') {
        inputSection.classList.remove('hidden');
        outputSection.classList.remove('hidden');
        if (docSection) docSection.classList.remove('hidden');
        if (updateCallersSection) updateCallersSection.classList.remove('hidden');
        if (docStringInput) docStringInput.value = tab.docString || '';
        refreshInputList();
        refreshOutputList();
    } else {
        inputSection.classList.add('hidden');
        outputSection.classList.add('hidden');
        if (docSection) docSection.classList.add('hidden');
        if (updateCallersSection) updateCallersSection.classList.add('hidden');
    }
}

function refreshFunctionsList() {
    const listEl = document.getElementById('function-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    const funcTabs = tabManager.getAllFunctionTabs();
    for (const ft of funcTabs) {
        const li = document.createElement('li');
        li.className = 'left-panel-variable';
        li.style.borderWidth = '2px';
        li.style.borderStyle = 'solid';
        li.style.borderColor = colorMap['Call'] || '#00bfa5';
        li.style.boxShadow = `inset 0px 0px 5px ${colorMap['Call'] || '#00bfa5'}`;
        li.style.backgroundColor = 'transparent';
        li.setAttribute('draggable', 'true');

        const nameSpan = document.createElement('span');
        nameSpan.className = 'var-name-text';
        nameSpan.textContent = ft.name;
        nameSpan.style.overflow = 'hidden';
        nameSpan.style.textOverflow = 'ellipsis';
        nameSpan.style.whiteSpace = 'nowrap';
        nameSpan.style.flex = '1';
        li.appendChild(nameSpan);

        let docIcon = null;
        if (ft.docString) {
            docIcon = document.createElement('span');
            docIcon.className = 'function-list-doc-icon';
            docIcon.textContent = 'i';
            docIcon.title = 'Documentation';
            li.appendChild(docIcon);
        }

        const infoSpan = document.createElement('span');
        infoSpan.style.fontSize = '0.8rem';
        infoSpan.style.opacity = '0.5';
        infoSpan.style.marginLeft = '0.3rem';
        const inCount = ft.inputParams.length;
        const outCount = ft.outputParams.length;
        infoSpan.textContent = `(${inCount}→${outCount})`;
        li.appendChild(infoSpan);

        li.addEventListener('mouseover', () => {
            li.style.boxShadow = `inset 0px 0px 30px ${colorMap['Call'] || '#00bfa5'}`;
        });
        li.addEventListener('mouseleave', () => {
            li.style.boxShadow = `inset 0px 0px 5px ${colorMap['Call'] || '#00bfa5'}`;
            if (docIcon) hideDocTooltip(docIcon);
        });

        if (docIcon) {
            li.addEventListener('mouseenter', (e) => {
                showDocTooltip(docIcon, ft.docString);
            });
        }

        li.addEventListener('dblclick', () => {
            tabManager.switchTab(ft.id);
        });

        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('functionTabId', ft.id);
            e.dataTransfer.setData('functionName', ft.name);
        });

        listEl.appendChild(li);
    }
}

function refreshContextMenuFunctions() {
    let section = document.getElementById('context-menu-functions-section');
    const contextMenu = document.getElementById('context-menu');
    if (!contextMenu) return;

    if (section) {
        section.remove();
    }

    const funcTabs = tabManager.getAllFunctionTabs();
    if (funcTabs.length === 0) return;

    section = document.createElement('div');
    section.className = 'ctx-menu-section';
    section.id = 'context-menu-functions-section';
    section.dataset.category = 'Functions';

    const callColor = colorMap['Call'] || '#00bfa5';
    const header = document.createElement('div');
    header.className = 'ctx-menu-section-header';
    header.style.borderLeftColor = callColor;
    header.style.color = callColor;

    const arrow = document.createElement('span');
    arrow.className = 'ctx-menu-section-arrow';
    arrow.textContent = '\u25BC';
    const label = document.createElement('span');
    label.textContent = 'Functions';
    header.appendChild(arrow);
    header.appendChild(label);

    header.addEventListener('click', (e) => {
        e.stopPropagation();
        const collapsed = section.classList.toggle('ctx-menu-section--collapsed');
        arrow.textContent = collapsed ? '\u25B6' : '\u25BC';
    });

    const body = document.createElement('div');
    body.className = 'ctx-menu-section-body';

    for (const ft of funcTabs) {
        const item = document.createElement('div');
        item.className = 'context-menu-items';
        item.textContent = `Call ${ft.name}`;
        item.dataset.functionTabId = ft.id;
        item.style.borderLeftColor = callColor;
        item.style.color = callColor;

        item.addEventListener('click', () => {
            const stage = tabManager.getStage();
            const activeLayer = tabManager.getActiveLayer();
            const rect = item.getBoundingClientRect();
            const containerRect = stage.container().getBoundingClientRect();
            const x = rect.x - containerRect.x;
            const y = rect.y - containerRect.y;
            Nodes.CreateCallNode(ft.name, ft.inputParams, ft.outputParams,
                { x, y }, activeLayer, stage, ft.docString || '');
            activeLayer.draw();
            document.getElementById('ctx-menu-container').classList.add('hidden');
        });

        body.appendChild(item);
    }

    section.appendChild(header);
    section.appendChild(body);
    contextMenu.appendChild(section);
}
