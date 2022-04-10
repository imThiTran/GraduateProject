//Block the user
window.onload = disableSelect();

function disableSelect() {
    const selectPcs = document.querySelectorAll('.sl-active');
    selectPcs.forEach(element => {
        element && (element.disabled = true);
    });
}

function toggleSelect(e) {
    const selectPc = e.parentElement.parentElement.querySelector('.sl-active');
    selectPc && (selectPc.disabled = e.checked);
}