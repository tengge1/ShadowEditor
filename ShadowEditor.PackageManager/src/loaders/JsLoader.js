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
        script.onload = script.onreadystatechange = () => {
            if (this.readyState === "loaded" || this.readyState === "complete") {
                script.onload = script.onreadystatechange = null;
                resolve(script);
            }
        };
        script.onerror = () => {
            console.warn(`JsLoader: ${url}加载失败！`);
            resolve(null);
        };
    });
};

export default JsLoader;