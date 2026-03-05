import { colorMap } from '../core/colorMap.js'

let placeLocation = function (location, stage) {
    return {
        x: (location.x - stage.x()) / stage.scaleX(),
        y: (location.y - stage.y()) / stage.scaleY()
    };
}

const MIN_GROUP_SIZE = 30;
const HANDLE_SIZE = 8;
const TITLE_HEIGHT = 24;
const MIN_RESIZE_W = 60;
const MIN_RESIZE_H = 50;

function createHandles(bodyRect, titleBar, titleText, grp, layer, stage, closeBtn) {
    const handles = [];
    const corners = ['tl', 'tr', 'bl', 'br'];

    for (const corner of corners) {
        const handle = new Konva.Rect({
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            fill: colorMap['GroupHandle'],
            stroke: colorMap['GroupHandleBorder'],
            strokeWidth: 1,
            draggable: true,
            name: 'groupResizeHandle',
        });
        const cursor = (corner === 'tl' || corner === 'br') ? 'nwse-resize' : 'nesw-resize';
        handle.on('mouseenter', () => { document.body.style.cursor = cursor; });
        handle.on('mouseleave', () => { document.body.style.cursor = 'default'; });

        handle.on('dragmove', () => {
            const hx = handle.x();
            const hy = handle.y();
            let x = bodyRect.x();
            let y = bodyRect.y();
            let w = bodyRect.width();
            let h = bodyRect.height();

            if (corner === 'tl') {
                const right = x + w;
                const bottom = y + h;
                x = Math.min(hx, right - MIN_RESIZE_W);
                y = Math.min(hy, bottom - MIN_RESIZE_H);
                w = right - x;
                h = bottom - y;
            } else if (corner === 'tr') {
                const bottom = y + h;
                w = Math.max(hx + HANDLE_SIZE - x, MIN_RESIZE_W);
                y = Math.min(hy, bottom - MIN_RESIZE_H);
                h = bottom - y;
            } else if (corner === 'bl') {
                const right = x + w;
                x = Math.min(hx, right - MIN_RESIZE_W);
                w = right - x;
                h = Math.max(hy + HANDLE_SIZE - y, MIN_RESIZE_H);
            } else {
                w = Math.max(hx + HANDLE_SIZE - x, MIN_RESIZE_W);
                h = Math.max(hy + HANDLE_SIZE - y, MIN_RESIZE_H);
            }

            bodyRect.x(x);
            bodyRect.y(y);
            bodyRect.width(w);
            bodyRect.height(h);
            titleBar.x(x);
            titleBar.y(y);
            titleBar.width(w);
            titleText.x(x + 6);
            titleText.y(y + 4);
            titleText.width(w - 12);
            if (closeBtn) {
                closeBtn.x(x + w - 16 - 4);
                closeBtn.y(y + Math.round((TITLE_HEIGHT - 16) / 2));
            }
            positionHandles(handles, bodyRect);
            layer.batchDraw();
        });

        handle.on('dragstart', (e) => { e.cancelBubble = true; });
        handle.on('dragend', (e) => { e.cancelBubble = true; });

        handles.push({ rect: handle, corner });
        grp.add(handle);
    }

    positionHandles(handles, bodyRect);
    return handles;
}

function positionHandles(handles, bodyRect) {
    const x = bodyRect.x();
    const y = bodyRect.y();
    const w = bodyRect.width();
    const h = bodyRect.height();
    const half = HANDLE_SIZE / 2;

    for (const h_obj of handles) {
        switch (h_obj.corner) {
            case 'tl': h_obj.rect.position({ x: x - half, y: y - half }); break;
            case 'tr': h_obj.rect.position({ x: x + w - half, y: y - half }); break;
            case 'bl': h_obj.rect.position({ x: x - half, y: y + h - half }); break;
            case 'br': h_obj.rect.position({ x: x + w - half, y: y + h - half }); break;
        }
    }
}

let activeEditState = null;
let groupInputInitialized = false;

function initGroupInput() {
    if (groupInputInitialized) return;
    groupInputInitialized = true;
    const htmlInput = document.getElementById('group-name-ip');

    htmlInput.addEventListener('blur', () => {
        if (!activeEditState) return;
        const { titleText, grp, layer } = activeEditState;
        const val = htmlInput.value.trim() || 'Group';
        titleText.text(val);
        grp._groupName = val;
        titleText.visible(true);
        htmlInput.style.display = 'none';
        htmlInput.value = '';
        activeEditState = null;
        layer.batchDraw();
    });

    htmlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') htmlInput.blur();
    });
}

function setupTitleEditing(titleText, titleBar, grp, stage, layer) {
    initGroupInput();
    const htmlInput = document.getElementById('group-name-ip');

    function startEdit() {
        if (activeEditState) htmlInput.blur();
        activeEditState = { titleText, grp, layer };
        htmlInput.value = titleText.text();
        const stageRect = stage.getContainer().getBoundingClientRect();
        const borderLeft = parseInt(getComputedStyle(stage.getContainer()).borderLeftWidth) || 0;
        const borderTop = parseInt(getComputedStyle(stage.getContainer()).borderTopWidth) || 0;
        const absPos = titleText.getAbsolutePosition();
        htmlInput.style.left = (stageRect.x + borderLeft + absPos.x) + 'px';
        htmlInput.style.top = (stageRect.y + borderTop + absPos.y) + 'px';
        htmlInput.style.transform = `scale(${stage.scaleX()})`;
        htmlInput.style.display = 'inline-block';
        htmlInput.focus();
        htmlInput.select();
        titleText.visible(false);
        layer.batchDraw();
    }

    titleBar.on('dblclick', startEdit);
    titleText.on('dblclick', startEdit);
}

function findContainedNodes(grp, layer) {
    const bodyRect = grp.find('Rect')[0];
    const gx = grp.x() + bodyRect.x();
    const gy = grp.y() + bodyRect.y();
    const gw = bodyRect.width();
    const gh = bodyRect.height();
    const nodes = [];
    layer.find('.aProgramNodeGroup').forEach((node) => {
        const nx = node.x();
        const ny = node.y();
        if (nx >= gx && ny >= gy && nx <= gx + gw && ny <= gy + gh) {
            nodes.push(node);
        }
    });
    return nodes;
}

function setupGroupDrag(grp, layer, stage) {
    let containedNodes = [];
    let nodeOffsets = [];
    let wireLayer = null;

    grp.on('dragstart', (e) => {
        e.cancelBubble = true;
        wireLayer = stage.findOne('#wireLayer');
        containedNodes = findContainedNodes(grp, layer);
        nodeOffsets = containedNodes.map((node) => ({
            node,
            offsetX: node.x() - grp.x(),
            offsetY: node.y() - grp.y(),
        }));
    });

    grp.on('dragmove', (e) => {
        e.cancelBubble = true;
        for (const entry of nodeOffsets) {
            entry.node.position({
                x: grp.x() + entry.offsetX,
                y: grp.y() + entry.offsetY,
            });
            entry.node.fire('dragmove');
        }
        layer.batchDraw();
        if (wireLayer) wireLayer.batchDraw();
    });

    grp.on('dragend', (e) => {
        e.cancelBubble = true;
        grp.moveToBottom();
        containedNodes = [];
        nodeOffsets = [];
        layer.batchDraw();
        if (wireLayer) wireLayer.batchDraw();
    });
}

export function createNodeGroup(position, width, height, name, layer, stage) {
    const grp = new Konva.Group({
        x: position.x,
        y: position.y,
        draggable: true,
        name: 'aNodeGroup',
    });
    grp._groupName = name || 'Group';

    const bodyRect = new Konva.Rect({
        x: 0,
        y: 0,
        width: width,
        height: height,
        fill: colorMap['GroupBody'],
        stroke: colorMap['GroupBorder'],
        strokeWidth: 1.5,
        cornerRadius: 6,
    });

    const titleBar = new Konva.Rect({
        x: 0,
        y: 0,
        width: width,
        height: TITLE_HEIGHT,
        fill: colorMap['GroupTitleBar'],
        cornerRadius: [6, 6, 0, 0],
    });

    const titleText = new Konva.Text({
        x: 6,
        y: 4,
        text: grp._groupName,
        fontSize: 13,
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fill: colorMap['GroupTitleText'],
        width: width - 12,
        height: TITLE_HEIGHT,
        listening: true,
    });

    const btnSize = 16;
    const closeBtn = new Konva.Group({
        x: width - btnSize - 4,
        y: Math.round((TITLE_HEIGHT - btnSize) / 2),
        visible: false,
    });
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
        layer.batchDraw();
    });
    closeBtn.on('mouseleave', () => {
        btnBg.fill('rgba(0,0,0,0.5)');
        document.body.style.cursor = 'default';
        layer.batchDraw();
    });
    closeBtn.on('mousedown', (e) => { e.cancelBubble = true; });
    closeBtn.on('click', (e) => {
        e.cancelBubble = true;
        document.body.style.cursor = 'default';
        grp.destroy();
        layer.batchDraw();
    });

    grp.add(bodyRect);
    grp.add(titleBar);
    grp.add(titleText);
    grp.add(closeBtn);

    grp.on('mouseenter', () => { closeBtn.visible(true); layer.batchDraw(); });
    grp.on('mouseleave', () => { closeBtn.visible(false); layer.batchDraw(); });

    const handles = createHandles(bodyRect, titleBar, titleText, grp, layer, stage, closeBtn);

    setupTitleEditing(titleText, titleBar, grp, stage, layer);
    setupGroupDrag(grp, layer, stage);

    layer.add(grp);
    grp.moveToBottom();
    layer.batchDraw();

    return grp;
}

export function getGroupsData(layer) {
    const groups = [];
    layer.find('.aNodeGroup').forEach((grp) => {
        const bodyRect = grp.find('Rect')[0];
        groups.push({
            position: { x: grp.x(), y: grp.y() },
            width: bodyRect.width(),
            height: bodyRect.height(),
            name: grp._groupName || 'Group',
        });
    });
    return groups;
}

export function enableNodeGroups(stage, layer) {
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let previewRect = null;

    stage.on('mousedown', (e) => {
        if (!e.evt.shiftKey || e.target !== stage || e.evt.button !== 0) return;

        isDrawing = true;
        const pos = placeLocation(stage.getPointerPosition(), stage);
        startX = pos.x;
        startY = pos.y;

        previewRect = new Konva.Rect({
            x: startX,
            y: startY,
            width: 0,
            height: 0,
            fill: colorMap['GroupPreview'],
            stroke: colorMap['GroupPreviewBorder'],
            strokeWidth: 1.5,
            dash: [6, 3],
            cornerRadius: 6,
        });
        layer.add(previewRect);
        layer.batchDraw();
    });

    stage.on('mousemove', () => {
        if (!isDrawing || !previewRect) return;

        const pos = placeLocation(stage.getPointerPosition(), stage);
        previewRect.setAttrs({
            x: Math.min(startX, pos.x),
            y: Math.min(startY, pos.y),
            width: Math.abs(pos.x - startX),
            height: Math.abs(pos.y - startY),
        });
        layer.batchDraw();
    });

    stage.on('mouseup', (e) => {
        if (!isDrawing || !previewRect) return;
        isDrawing = false;

        const w = previewRect.width();
        const h = previewRect.height();
        const x = previewRect.x();
        const y = previewRect.y();

        previewRect.destroy();
        previewRect = null;

        if (w < MIN_GROUP_SIZE || h < MIN_GROUP_SIZE) {
            layer.batchDraw();
            return;
        }

        createNodeGroup({ x, y }, w, h, 'Group', layer, stage);
    });
}
