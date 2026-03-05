import { deleteWire } from '../editor/deleteHandler.js';
import { tabManager } from '../editor/tabManager.js';

/**
 * Check if two data types are compatible (no mismatch).
 * Data type is universal; otherwise types must match.
 */
export function isTypeCompatible(srcType, destType) {
    if (!srcType || !destType) return true;
    if (srcType === 'Data' || destType === 'Data') return true;
    return srcType === destType;
}

/**
 * Apply dashed line and type-mismatch indicator to a wire.
 * @param {Konva.Line} wire
 * @param {Konva.Layer} wireLayer
 * @param {Konva.Stage} [stage] - for draw() after delete
 */
export function applyMismatchToWire(wire, wireLayer, stage) {
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
        const s = stage || (wireLayer && wireLayer.getStage()) || tabManager.getStage();
        if (s) s.draw();
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

/**
 * Remove mismatch styling from a wire.
 */
export function removeMismatchFromWire(wire) {
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
