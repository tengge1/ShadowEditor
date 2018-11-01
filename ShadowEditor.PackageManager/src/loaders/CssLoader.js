/**
 * CSS下载器
 * @author tengge / https://github.com/tengge1
 */
function CssLoader() {

};

CssLoader.prototype.load = function (url) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    head.appendChild(link);

    return new Promise(resolve => {
        link.onload = event => {
            link.onload = link.onerror = null;
            resolve(link);
        };
        link.onerror = event => {
            link.onload = link.onerror = null;
            console.warn(`CssLoader: ${url}加载失败。`);
            resolve(null);
        };
    });
};

export default CssLoader;