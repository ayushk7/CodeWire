import { showAlert, showConfirm } from '../ui/dialogs.js';

const JS_RESERVED = new Set([
    'break','case','catch','continue','debugger','default','delete','do',
    'else','finally','for','function','if','in','instanceof','new','return',
    'switch','this','throw','try','typeof','var','void','while','with',
    'class','const','enum','export','extends','import','super','implements',
    'interface','let','package','private','protected','public','static','yield',
    'await','async','null','undefined','true','false','NaN','Infinity',
]);

export function isValidFunctionName(name) {
    if (!name || name.length === 0) return false;
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) return false;
    if (JS_RESERVED.has(name)) return false;
    return true;
}

class TabManager {
    constructor() {
        this._stage = null;
        this._tabs = new Map();
        this._activeTabId = null;
        this._nextId = 1;
        this._listeners = {};
        this._sharedDragLayer = null;
    }

    init(stage, mainLayer, mainWireLayer, dragLayer) {
        this._stage = stage;
        this._sharedDragLayer = dragLayer;
        const mainTab = {
            id: 'main',
            name: 'Main',
            type: 'main',
            layer: mainLayer,
            wireLayer: mainWireLayer,
            inputParams: [],
            outputParams: [],
            beginNodeId: null,
            returnNodeId: null,
            variables: [],
        };
        this._tabs.set('main', mainTab);
        this._activeTabId = 'main';
        this._renderTabBar();
    }

    getActiveTab() { return this._tabs.get(this._activeTabId); }
    getActiveTabId() { return this._activeTabId; }
    getActiveLayer() { return this._tabs.get(this._activeTabId).layer; }
    getActiveWireLayer() { return this._tabs.get(this._activeTabId).wireLayer; }
    getDragLayer() { return this._sharedDragLayer; }
    getStage() { return this._stage; }

    getTab(id) { return this._tabs.get(id); }
    getAllTabs() { return [...this._tabs.values()]; }
    getAllFunctionTabs() { return [...this._tabs.values()].filter(t => t.type === 'function'); }
    getAllSavedFunctionTabs() { return [...this._tabs.values()].filter(t => t.type === 'function' && t.saved); }

    createTab(name) {
        if (!isValidFunctionName(name)) {
            showAlert('Invalid function name. Use letters, numbers, and underscores. Must start with a letter or underscore.');
            return null;
        }
        if (this._isDuplicateName(name)) {
            showAlert(`Function "${name}" already exists.`);
            return null;
        }

        const id = `func_${this._nextId++}`;
        const layer = new Konva.Layer({ id: `layer_${id}` });
        const wireLayer = new Konva.Layer({ id: `wireLayer_${id}` });

        this._stage.add(wireLayer);
        this._stage.add(layer);
        layer.moveToBottom();

        layer.hide();
        wireLayer.hide();

        const tab = {
            id,
            name,
            type: 'function',
            layer,
            wireLayer,
            inputParams: [],
            outputParams: [],
            beginNodeId: null,
            returnNodeId: null,
            variables: [],
            docString: '',
            saved: null,
        };

        this._tabs.set(id, tab);
        this._renderTabBar();
        this.switchTab(id);
        this._emit('tabCreated', tab);
        return tab;
    }

    switchTab(id) {
        if (!this._tabs.has(id) || id === this._activeTabId) return;

        const prevTab = this._tabs.get(this._activeTabId);
        prevTab.layer.hide();
        prevTab.wireLayer.hide();

        this._activeTabId = id;
        const newTab = this._tabs.get(id);
        newTab.layer.show();
        newTab.wireLayer.show();

        this._stage.draw();
        this._updateTabBarSelection();
        this._emit('tabSwitched', { from: prevTab, to: newTab });
    }

    renameTab(id, newName) {
        if (id === 'main') return false;
        if (!isValidFunctionName(newName)) {
            showAlert('Invalid function name.');
            return false;
        }
        if (this._isDuplicateName(newName, id)) {
            showAlert(`Function "${newName}" already exists.`);
            return false;
        }

        const tab = this._tabs.get(id);
        if (!tab) return false;
        const oldName = tab.name;
        tab.name = newName;
        if (tab.saved) tab.saved.name = newName;
        this._renderTabBar();
        this._emit('tabRenamed', { tab, oldName, newName });
        return true;
    }

    closeTab(id) {
        if (id === 'main') return false;
        const tab = this._tabs.get(id);
        if (!tab) return false;

        if (this._activeTabId === id) {
            this.switchTab('main');
        }

        tab.layer.destroy();
        tab.wireLayer.destroy();
        this._tabs.delete(id);

        this._renderTabBar();
        this._emit('tabClosed', tab);
        this._stage.draw();
        return true;
    }

    getFunctionDefinition(tabId) {
        const tab = this._tabs.get(tabId);
        if (!tab || tab.type !== 'function') return null;
        return {
            name: tab.name,
            inputs: [...tab.inputParams],
            outputs: [...tab.outputParams],
        };
    }

    saveFunction(tabId) {
        const tab = this._tabs.get(tabId);
        if (!tab || tab.type !== 'function') return;
        tab.saved = {
            name: tab.name,
            inputParams: tab.inputParams.map(p => ({ ...p })),
            outputParams: tab.outputParams.map(p => ({ ...p })),
            docString: tab.docString || '',
        };
        this._emit('functionSaved', tab);
    }

    on(event, fn) {
        if (!this._listeners[event]) this._listeners[event] = [];
        this._listeners[event].push(fn);
    }

    off(event, fn) {
        if (!this._listeners[event]) return;
        this._listeners[event] = this._listeners[event].filter(f => f !== fn);
    }

    _emit(event, data) {
        if (this._listeners[event]) {
            this._listeners[event].forEach(fn => fn(data));
        }
    }

    _isDuplicateName(name, excludeId) {
        for (const [id, tab] of this._tabs) {
            if (id !== excludeId && tab.name === name) return true;
        }
        return false;
    }

    _renderTabBar() {
        const tabList = document.getElementById('tab-list');
        if (!tabList) return;
        tabList.innerHTML = '';

        for (const [id, tab] of this._tabs) {
            const tabEl = document.createElement('div');
            tabEl.className = 'tab-item';
            if (id === this._activeTabId) tabEl.classList.add('tab-active');
            tabEl.dataset.tabId = id;

            const nameEl = document.createElement('span');
            nameEl.className = 'tab-name';
            nameEl.textContent = tab.name;
            tabEl.appendChild(nameEl);

            if (tab.type === 'function') {
                nameEl.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    this._startRename(tabEl, tab);
                });

                const closeBtn = document.createElement('span');
                closeBtn.className = 'tab-close';
                closeBtn.textContent = '\u00D7';
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showConfirm(
                        `Close function "<span style="color:#d65a31">${tab.name}</span>"? The function definition and its contents will be removed.`,
                        () => { this.closeTab(id); }
                    );
                });
                tabEl.appendChild(closeBtn);
            }

            tabEl.addEventListener('click', () => {
                this.switchTab(id);
            });

            tabList.appendChild(tabEl);
        }
    }

    _updateTabBarSelection() {
        const tabList = document.getElementById('tab-list');
        if (!tabList) return;
        tabList.querySelectorAll('.tab-item').forEach(el => {
            el.classList.toggle('tab-active', el.dataset.tabId === this._activeTabId);
        });
    }

    _startRename(tabEl, tab) {
        const nameEl = tabEl.querySelector('.tab-name');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'tab-rename-input';
        input.value = tab.name;

        nameEl.replaceWith(input);
        input.focus();
        input.select();

        let finished = false;
        const doFinish = () => {
            if (finished) return;
            finished = true;
            const newName = input.value.trim();
            if (newName && newName !== tab.name) {
                this.renameTab(tab.id, newName);
            } else {
                this._renderTabBar();
            }
        };

        input.addEventListener('blur', doFinish);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
            if (e.key === 'Escape') { input.value = tab.name; input.blur(); }
        });
    }
}

export const tabManager = new TabManager();
