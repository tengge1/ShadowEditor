/**
 * Css下载器
 */
function CssLoader() {

}

CssLoader.prototype.load = function (url) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    head.appendChild(link);
};

export { CssLoader };