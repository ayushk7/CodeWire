import { refresh } from '../persistence/saveAndLoad.js'
import { Import } from '../persistence/saveAndLoad.js'

export function showAlert(msg) {
    let alertMsg = document.getElementById("alert-box").children[0].children[0];
    let alertBox = document.getElementById("alert-box");
    document.getElementById("alert-ok-btn").addEventListener("click", (e) => {
        alertBox.classList.toggle("hidden", true);
    });
    alertMsg.innerHTML = `<span style="color: tomato;">Alert:</span> ${msg}`;
    alertBox.classList.toggle('hidden', false);
    [...document.getElementsByClassName("sidebox")].forEach(value => {
        if (value !== alertBox) {
            value.classList.toggle("hidden", true);
        }
        else {
            value.classList.toggle("hidden", false);
        }
    })
}

export function showConfirm(msg, onConfirm) {
    const dialog = document.getElementById("confirm-dialog");
    const msgEl = document.getElementById("confirm-dialog-msg");
    const okBtn = document.getElementById("confirm-dialog-ok");
    const cancelBtn = document.getElementById("confirm-dialog-cancel");

    msgEl.innerHTML = msg;

    [...document.getElementsByClassName("sidebox")].forEach(value => {
        if (value !== dialog) {
            value.classList.toggle("hidden", true);
        }
    });
    dialog.classList.toggle("hidden", false);

    const cleanup = () => {
        dialog.classList.toggle("hidden", true);
        okBtn.removeEventListener("click", handleOk);
        cancelBtn.removeEventListener("click", handleCancel);
    };
    const handleOk = () => {
        cleanup();
        onConfirm();
    };
    const handleCancel = () => {
        cleanup();
    };
    okBtn.addEventListener("click", handleOk);
    cancelBtn.addEventListener("click", handleCancel);
}

// <div style="font-size: 1.2rem; color: white; padding: 10px; margin-top: 10px; text-align: center"><span
//                     style="color: tomato;">Alert:</span> Current Scipt Will Be Lost Unless Exported</div>

export function prompRefreshOrStarter(type, stage) {
    let refreshBox = document.getElementById("refresh-box");
    let refBtn = document.getElementById("refresh-btn");
    let refCnclBtn = document.getElementById("refresh-cancel-btn");
    // console.log("refresh clicked");
    if (type == 'refresh') {
        refreshBox.children[0].children[1].innerHTML = 'Refresh'
        refreshBox.classList.toggle('hidden', false);
        [...document.getElementsByClassName("sidebox")].forEach(value => {
            if (value !== refreshBox) {
                value.classList.toggle("hidden", true);
            }
            else {
                value.classList.toggle("hidden", false);
            }
        });
        refBtn.addEventListener("click", (e) => {
            refresh(stage.findOne("#main_layer"), stage.findOne("#wireLayer"));
            refreshBox.classList.toggle('hidden', true);
        });
        refCnclBtn.addEventListener("click", (e) => {
            refreshBox.classList.toggle('hidden', true);
        });
    }
    if (type == 'starter') {
        refreshBox.children[0].children[1].innerHTML = 'Load';
        refreshBox.classList.toggle('hidden', false);
        [...document.getElementsByClassName("sidebox")].forEach(value => {
            if (value !== refreshBox) {
                value.classList.toggle("hidden", true);
            }
            else {
                value.classList.toggle("hidden", false);
            }
        });
        refBtn.addEventListener("click", (e) => {
            refreshBox.classList.toggle('hidden', true);
            vscriptOnLoad(stage);
        });
        refCnclBtn.addEventListener("click", (e) => {
            refreshBox.classList.toggle('hidden', true);
        }) ;
    }
}
const STARTER_FILE_PATH = 'assets/starter.json';

export async function vscriptOnLoad(stage) {
    const layer = stage.findOne('#main_layer');
    const wireLayer = stage.findOne('#wireLayer');
    try {
        const res = await fetch(STARTER_FILE_PATH);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const starterJSON = await res.text();
        new Import(stage, layer, wireLayer, starterJSON);
    } catch (err) {
        console.error('Failed to load starter.json:', err);
        showAlert('Could not load starter.json. Using empty project.');
        refresh(layer, wireLayer);
    }
}

