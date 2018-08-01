var link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link); // Firefox workaround, see #6594

/**
 * 将数字凑成2的指数次幂
 * @param {*} num 数字
 */
function makePowOfTwo(num) {
    var result = 1;
    while (result < num) {
        result = result * 2;
    }
    return result;
}

function save(blob, filename) {
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'data.json';
    link.click();
    // URL.revokeObjectURL( url ); breaks Firefox...
}

/**
 * 下载字符串文件
 * @param {*} text 
 * @param {*} filename 
 */
function saveString(text, filename) {
    save(new Blob([text], { type: 'text/plain' }), filename);
}

const StringUtils = {
    makePowOfTwo: makePowOfTwo,
    save: save,
    saveString: saveString
};

export default StringUtils;