/**
 * Doc tooltip for DOM elements (e.g. function list info icon).
 * Uses the same CSS class as call-node-doc-tooltip.
 */
let _el = null;
let _owner = null;

function getOrCreateEl() {
    if (_el) return _el;
    const el = document.createElement('div');
    el.className = 'call-node-doc-tooltip';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    _el = el;
    return el;
}

export function showDocTooltip(anchorEl, docString) {
    if (!docString || !anchorEl) return;
    const el = getOrCreateEl();
    _owner = anchorEl;
    el.textContent = docString;
    el.style.display = 'block';
    el.style.visibility = 'hidden';

    const rect = anchorEl.getBoundingClientRect();
    const tw = el.offsetWidth;
    const th = el.offsetHeight;
    const gap = 8;
    let left = rect.left + (rect.width / 2) - (tw / 2);
    let top = rect.top - th - gap;
    left = Math.max(6, Math.min(left, document.documentElement.clientWidth - tw - 6));
    top = Math.max(6, Math.min(top, document.documentElement.clientHeight - th - 6));
    el.style.left = Math.round(left) + 'px';
    el.style.top = Math.round(top) + 'px';
    el.style.visibility = 'visible';
}

export function hideDocTooltip(anchorEl) {
    if (_owner !== anchorEl) return;
    _owner = null;
    if (_el) {
        _el.style.display = 'none';
        _el.textContent = '';
    }
}
