/**
 * JS下载器
 * @author tengge / https://github.com/tengge1
 */
function JsLoader() {

};

JsLoader.prototype.load = function (url) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);

    return new Promise(resolve => {
        script.onload = event => {
            script.onload = script.onerror = null;
            resolve(script);
        };
        script.onerror = event => {
            script.onload = script.onerror = null;
            console.warn(`JsLoader: ${url}加载失败！`);
            resolve(null);
        };
    });
};

export default JsLoader;