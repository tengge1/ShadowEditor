var link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link); // Firefox workaround, see #6594

function save(blob, filename) {
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'data.json';
    link.click();
    // URL.revokeObjectURL( url ); breaks Firefox...
}

function saveString(text, filename) {
    save(new Blob([text], { type: 'text/plain' }), filename);
}

const StringUtils = {
    save: save,
    saveString: saveString
};

export default StringUtils;