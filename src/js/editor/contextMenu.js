import { setLocationOfNode } from '../nodes/nodePosition.js'
import { Nodes } from '../nodes/nodeFactory.js'
import { variableList } from '../ui/variableList.js'
import { deleteProgramNode, deleteWire } from './deleteHandler.js'
import { getMenuOrderGroupedByCategory, getDefinition } from '../registry/index.js'
import { colorMap, lightenHex } from '../core/colorMap.js'
import { tabManager } from './tabManager.js'

const CATEGORY_LABELS = {
    Begin: 'Flow',
    Print: 'I/O',
    Logic: 'Logic',
    Math: 'Math',
    Str: 'String',
    Obj: 'Object / Map',
    Get: 'Array',
    Func: 'Utility',
};

const DEFAULT_EXPANDED_CATEGORIES = new Set(['Begin', 'Logic']);

export var ContextMenu = {
    contextMenu: function (stage) {
        let contextMenu = document.getElementById("ctx-menu-container");
        let contextMenuList = document.getElementById("context-menu");
        let deleteCtxMenu = document.getElementById("delete-ctx-container");
        let getSetCtxMenu = document.getElementById("get-set-ctx-menu-container");
        let searchBar = document.getElementById("ctx-search-bar");

        // Build context menu from registry, grouped by category (collapsible sections)
        contextMenuList.innerHTML = '';
        const { categoryOrder, groups } = getMenuOrderGroupedByCategory();
        for (const category of categoryOrder) {
            const ids = groups[category] || [];
            if (ids.length === 0) continue;
            const section = document.createElement('div');
            section.className = 'ctx-menu-section';
            section.dataset.category = category;
            const expanded = DEFAULT_EXPANDED_CATEGORIES.has(category);
            if (!expanded) section.classList.add('ctx-menu-section--collapsed');
            const headerColor = colorMap[category] || colorMap['Text'];
            const menuTextColor = lightenHex(headerColor);
            const header = document.createElement('div');
            header.className = 'ctx-menu-section-header';
            header.style.borderLeftColor = headerColor;
            header.style.color = menuTextColor;
            const arrow = document.createElement('span');
            arrow.className = 'ctx-menu-section-arrow';
            arrow.textContent = expanded ? '\u25BC' : '\u25B6';
            const label = document.createElement('span');
            label.textContent = CATEGORY_LABELS[category] ?? category;
            header.appendChild(arrow);
            header.appendChild(label);
            header.title = 'Click to expand/collapse';
            const body = document.createElement('div');
            body.className = 'ctx-menu-section-body';
            for (const id of ids) {
                const def = getDefinition(id);
                if (!def) continue;
                const item = document.createElement('div');
                item.className = 'context-menu-items';
                item.textContent = def.label;
                item.dataset.nodeId = id;
                item.style.borderLeftColor = headerColor;
                item.style.color = menuTextColor;
                body.appendChild(item);
            }
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                const collapsed = section.classList.toggle('ctx-menu-section--collapsed');
                arrow.textContent = collapsed ? '\u25B6' : '\u25BC';
            });
            section.appendChild(header);
            section.appendChild(body);
            contextMenuList.appendChild(section);
        }
        // Variables section (expand/collapse) for Get/Set items added by variableList
        const variablesColor = colorMap['Get'] || colorMap['Text'];
        const variablesMenuColor = lightenHex(variablesColor);
        const variablesSection = document.createElement('div');
        variablesSection.className = 'ctx-menu-section';
        variablesSection.dataset.category = 'Variables';
        variablesSection.classList.add('ctx-menu-section--collapsed');
        const variablesHeader = document.createElement('div');
        variablesHeader.className = 'ctx-menu-section-header';
        variablesHeader.style.borderLeftColor = variablesColor;
        variablesHeader.style.color = variablesMenuColor;
        const variablesArrow = document.createElement('span');
        variablesArrow.className = 'ctx-menu-section-arrow';
        variablesArrow.textContent = '\u25B6';
        const variablesLabel = document.createElement('span');
        variablesLabel.textContent = 'Variables';
        variablesHeader.appendChild(variablesArrow);
        variablesHeader.appendChild(variablesLabel);
        variablesHeader.title = 'Click to expand/collapse';
        const variablesBody = document.createElement('div');
        variablesBody.className = 'ctx-menu-section-body';
        variablesBody.id = 'context-menu-variables-body';
        variablesHeader.addEventListener('click', (e) => {
            e.stopPropagation();
            const collapsed = variablesSection.classList.toggle('ctx-menu-section--collapsed');
            variablesArrow.textContent = collapsed ? '\u25B6' : '\u25BC';
        });
        variablesSection.appendChild(variablesHeader);
        variablesSection.appendChild(variablesBody);
        contextMenuList.appendChild(variablesSection);
        let draggedVariableInfo = {
            name: null,
            dataType: null,
        };
        function toggleContextMenu(location, show) {
            if (show) {
                contextMenu.classList.toggle("hidden", false);
                contextMenu.style.left = location[0] + 'px';
                contextMenu.style.top = location[1] + 'px';
                searchBar.focus();
            }
            else {
                contextMenu.classList.toggle("hidden", true);
                searchBar.value = '';
                resetSectionsVisibility();
            }
        }
        function resetSectionsVisibility() {
            const sections = contextMenuList.querySelectorAll('.ctx-menu-section');
            sections.forEach((section) => {
                const category = section.dataset.category;
                const expanded = DEFAULT_EXPANDED_CATEGORIES.has(category);
                section.classList.toggle('ctx-menu-section--collapsed', !expanded);
                section.classList.remove('hidden');
                const arr = section.querySelector('.ctx-menu-section-arrow');
                if (arr) arr.textContent = expanded ? '\u25BC' : '\u25B6';
                const items = section.querySelectorAll('.context-menu-items');
                items.forEach((el) => el.classList.remove('hidden'));
            });
            contextMenuList.querySelectorAll('.context-menu-items').forEach((el) => el.classList.remove('hidden'));
        }
        ContextMenu.resetFilter = function () {
            const bar = document.getElementById('ctx-search-bar');
            const list = document.getElementById('context-menu');
            if (bar) bar.value = '';
            if (list) {
                list.querySelectorAll('.ctx-menu-section').forEach((section) => {
                    const category = section.dataset.category;
                    const expanded = DEFAULT_EXPANDED_CATEGORIES.has(category);
                    section.classList.toggle('ctx-menu-section--collapsed', !expanded);
                    section.classList.remove('hidden');
                    const arr = section.querySelector('.ctx-menu-section-arrow');
                    if (arr) arr.textContent = expanded ? '\u25BC' : '\u25B6';
                    section.querySelectorAll('.context-menu-items').forEach((el) => el.classList.remove('hidden'));
                });
                list.querySelectorAll('.context-menu-items').forEach((el) => el.classList.remove('hidden'));
            }
        };
        function toggleDeleteCtxMenu(location, show) {
            if (show) {
                deleteCtxMenu.classList.toggle("hidden", false);
                deleteCtxMenu.style.left = location[0] + 'px';
                deleteCtxMenu.style.top = location[1] + 'px';

            }
            else {
                deleteCtxMenu.classList.toggle("hidden", true);
            }
        }
        function toggleGetSetCtxMenu(location, show) {
            if (show) {
                getSetCtxMenu.classList.toggle("hidden", false);
                getSetCtxMenu.style.left = location[0] + 'px';
                getSetCtxMenu.style.top = location[1] + 'px';
            }
            else {
                getSetCtxMenu.classList.toggle("hidden", true);
            }
        }
        ContextMenu.addEventToCtxMenuItems = function (e) {
            e.addEventListener('click', function (ev) {
                if (ev.target.classList.contains('ctx-menu-section-header')) return;
                makeNode(e, stage, tabManager.getActiveLayer(), toggleContextMenu);
            });
        };
        searchBar.addEventListener("input", (e) => {
            const key = e.target.value.toLowerCase().trim();
            const sections = contextMenuList.querySelectorAll('.ctx-menu-section');
            sections.forEach((section) => {
                const body = section.querySelector('.ctx-menu-section-body');
                const items = body ? body.querySelectorAll('.context-menu-items') : [];
                let hasMatch = false;
                items.forEach((item) => {
                    const label = (item.textContent || '').toLowerCase();
                    const nodeId = (item.dataset.nodeId || '').toLowerCase();
                    const match = !key || label.includes(key) || nodeId.includes(key);
                    item.classList.toggle('hidden', !match);
                    if (match) hasMatch = true;
                });
                section.classList.toggle('hidden', !key ? false : !hasMatch);
                if (key && hasMatch) {
                    section.classList.remove('ctx-menu-section--collapsed');
                    const arr = section.querySelector('.ctx-menu-section-arrow');
                    if (arr) arr.textContent = '\u25BC';
                }
            });
            const orphanItems = Array.from(contextMenuList.children).filter((el) => el.classList && el.classList.contains('context-menu-items'));
            orphanItems.forEach((item) => {
                const label = (item.textContent || '').toLowerCase();
                const match = !key || label.includes(key);
                item.classList.toggle('hidden', !match);
            });
        });

        contextMenuList.querySelectorAll('.context-menu-items').forEach((el) => {
            this.addEventToCtxMenuItems(el);
        });

        // let alreadyPresent = [];   // to prevent adding multiple eventListeners
        stage.on('contextmenu', function (e) {
            e.evt.preventDefault();
            if (e.target === stage) {
                let availY = stage.getContainer().getBoundingClientRect().height - e.evt.clientY;
                let offY = 0, offX = 0;
                if (availY <= 260) {
                    offY = -260;
                }
                let availX = stage.getContainer().getBoundingClientRect().width - e.evt.clientX;
                if (availX <= 200) {
                    offX = -200;
                }
                toggleContextMenu([e.evt.clientX + offX, e.evt.clientY + offY], true);
            }
            else {
                let parentGroup = e.target.getParent();
                let isNodeGroup = false;
                let nodeGroupRef = null;
                let tmp = e.target;
                while (tmp && tmp !== stage) {
                    if (tmp.name && tmp.name() === 'aNodeGroup') {
                        isNodeGroup = true;
                        nodeGroupRef = tmp;
                        break;
                    }
                    tmp = tmp.getParent ? tmp.getParent() : null;
                }

                toggleDeleteCtxMenu([e.evt.clientX - 130, e.evt.clientY - 35], true);
                deleteCtxMenu.onclick = function () {
                    if (isNodeGroup && nodeGroupRef) {
                        nodeGroupRef.destroy();
                        stage.draw();
                    }
                    else if (parentGroup && parentGroup.name() == 'aProgramNodeGroup') {
                        deleteProgramNode(e, tabManager.getActiveLayer(), stage);
                        stage.draw();
                    }
                    else if (e.target.name() == "isConnection") {
                        deleteWire(e.target);
                        stage.draw();
                    }
                    toggleDeleteCtxMenu([e.evt.clientX - 130, e.evt.clientY - 35], false);
                }
            };

        });
        stage.on('click', function (e) {
            toggleContextMenu([e.evt.clientX, e.evt.clientY], false);
            toggleDeleteCtxMenu([], false);
            toggleGetSetCtxMenu([], false);
        });
        document.addEventListener("click", (e) => {
            if (e.target !== stage.getContainer() && e.target !== searchBar)
                toggleContextMenu([0, 0], false);
            if (e.target !== stage.getContainer()) {
                toggleDeleteCtxMenu([], false);
                toggleGetSetCtxMenu([], false);
            }
        });

        getSetCtxMenu.addEventListener("click", (e) => {
            let nodeType = e.target.innerHTML + " " + draggedVariableInfo.name;
            let xx = e.target.parentElement.getBoundingClientRect().x - stage.getContainer().getBoundingClientRect().x;
            let yy = e.target.parentElement.getBoundingClientRect().y - stage.getContainer().getBoundingClientRect().y;
            let activeLayer = tabManager.getActiveLayer();
            if (e.target.innerHTML == "Get") {
                Nodes.CreateNode(nodeType, { x: xx, y: yy }, activeLayer, stage, "Get", draggedVariableInfo.dataType, null);
            }
            else {
                Nodes.CreateNode(nodeType, { x: xx, y: yy }, activeLayer, stage, "Set", draggedVariableInfo.dataType, null);
            }
        });


        stage.getContainer().addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        stage.getContainer().addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        stage.getContainer().addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.dataTransfer.getData("functionTabId")) {
                const funcTabId = e.dataTransfer.getData("functionTabId");
                const funcTab = tabManager.getTab(funcTabId);
                if (funcTab) {
                    const containerRect = stage.getContainer().getBoundingClientRect();
                    const x = e.clientX - containerRect.x;
                    const y = e.clientY - containerRect.y;
                    const activeLayer = tabManager.getActiveLayer();
                    Nodes.CreateCallNode(funcTab.name, funcTab.inputParams, funcTab.outputParams,
                        { x, y }, activeLayer, stage, funcTab.docString || '');
                    activeLayer.draw();
                }
            } else if (e.dataTransfer.getData("variableName")) {
                toggleGetSetCtxMenu([e.clientX, e.clientY], true);
                draggedVariableInfo = {
                    name: e.dataTransfer.getData("variableName"),
                    dataType: e.dataTransfer.getData("dataType"),
                }
            }
            e.stopPropagation();
        });

        tabManager.on('tabSwitched', () => {
            toggleContextMenu([0, 0], false);
            toggleDeleteCtxMenu([], false);
            toggleGetSetCtxMenu([], false);
            ContextMenu.resetFilter();
        });
    }
}



function makeNode(e, stage, layer, toggleContextMenu) {
    let xx = e.parentElement.getBoundingClientRect().x - stage.getContainer().getBoundingClientRect().x;
    let yy = e.parentElement.getBoundingClientRect().y - stage.getContainer().getBoundingClientRect().y;
    let dataType;
    if (e.dataset.datatype)
        dataType = e.dataset.datatype;
    const type = e.dataset.nodeId || e.innerHTML;
    let tmp = type.split(" ");
    let isGetSet = "";
    if (tmp[0] == "Get")
        isGetSet = "Get";
    else if (tmp[0] == "Set")
        isGetSet = "Set";
    let defValue = null;
    Nodes.CreateNode(type, { x: xx, y: yy }, layer, stage, isGetSet, dataType, defValue);
    layer.draw();
    toggleContextMenu([], false);
}
