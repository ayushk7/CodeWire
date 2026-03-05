import { deleteNodeByGroup } from './deleteHandler.js';

/**
 * Apply the same red overlay and "Deleted Var" / "Deleted Func" indicator used
 * when a variable or function is deleted but nodes still reference it.
 * @param {Konva.Group} grp - The program node group (must have customClass.bodyRect)
 * @param {Konva.Layer} layer - Layer for draw()
 * @param {Konva.Stage} stage - Stage for deleteNodeByGroup
 * @param {string} [label='Deleted Var'] - Label text (e.g. 'Deleted Func' for call nodes)
 */
export function applyOrphanOverlay(grp, layer, stage, label = 'Deleted Var') {
    const cc = grp.customClass;
    if (!cc) return;
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

    const labelText = new Konva.Text({
        text: label,
        fontSize: 9,
        fontFamily: 'Verdana',
        fill: '#f88',
        width: boxWidth,
        align: 'center',
        y: 3,
    });
    indicatorGrp.add(labelText);

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
        if (layer) layer.draw();
    });
    removeBtn.on('mouseleave', () => {
        removeBtn.fill('#fff');
        document.body.style.cursor = 'default';
        if (layer) layer.draw();
    });
    removeBtn.on('click', (e) => {
        e.cancelBubble = true;
        document.body.style.cursor = 'default';
        deleteNodeByGroup(grp, stage);
    });
    indicatorGrp.add(removeBtn);

    grp.add(indicatorGrp);
    cc._orphanOverlay = overlay;
    cc._orphanIndicator = indicatorGrp;
}
