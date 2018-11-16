/**
 * 异步加载css文件
 * @author tengge / https://github.com/tengge1
 * @param {*} url css文件url
 */
function loadCss(url) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    head.appendChild(link);
};

/**
 * css工具类
 */
const CssUtils = {
    load: loadCss
};

export default CssUtils;