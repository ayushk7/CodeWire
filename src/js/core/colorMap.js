/**
 * Color scheme: node categories (context menu + canvas) use distinct hues for quick recognition.
 * Data types (Number, String, etc.) and UI (MainLabel, Group*) are separate.
 */
export const colorMap = {
    // Data types (wires, inputs)
    'Number': '#00d0fa',
    'String': '#ed1a95',
    'Boolean': '#f30909',
    'Array': '#ccff33',
    'Data': '#ff7900',
    // UI
    'MainLabel': '#ffffff',
    'MainLabelBox': '#3282b8',
    'MainBoxGradient': {
        'start': '#28313b',
        'end': '#485461',
    },
    'Text': '#ffffff',
    // Node categories (menu + node headers)
    'Begin': '#e65100',   // Flow – warm orange (entry)
    'Print': '#c62828',   // I/O – red (output, dialogs)
    'Logic': '#7b1fa2',   // Control flow – purple
    'Math': '#1565c0',    // Numeric – blue
    'Func': '#00838f',    // Function/API – cyan
    'Get': '#2e7d32',     // Array / access – green
    'Str': '#ad1457',     // String – pink/magenta
    'Obj': '#00695c',     // Object / Map – teal
    'GroupBody': 'rgba(255, 255, 255, 0.31)',
    'GroupBorder': 'rgba(255,255,255,0.3)',
    'GroupTitleBar': 'rgba(41,68,150,0.8)',
    'GroupTitleText': '#e0e0e0',
    'GroupHandle': 'rgba(255,255,255,0.35)',
    'GroupHandleBorder': 'rgba(255,255,255,0.5)',
    'GroupPreview': 'rgba(100,150,255,0.08)',
    'GroupPreviewBorder': 'rgba(100,150,255,0.5)',
};

export function lightenHex(hex, amount = 0.45) {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, ((n >> 16) & 0xff) + Math.round((255 - ((n >> 16) & 0xff)) * amount));
    const g = Math.min(255, ((n >> 8) & 0xff) + Math.round((255 - ((n >> 8) & 0xff)) * amount));
    const b = Math.min(255, (n & 0xff) + Math.round((255 - (n & 0xff)) * amount));
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}