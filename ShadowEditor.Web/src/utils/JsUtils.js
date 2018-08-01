/**
 * 异步加载js文件
 * @param {*} url js文件url
 * @param {*} callback 回调函数
 */
function loadJs(url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
    if (typeof (callback) === 'function') {
        script.onload = script.onreadystatechange = function () {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                callback();
                script.onload = script.onreadystatechange = null;
            }
        };
    }
};

/**
 * js工具类
 */
const JsUtils = {
    load: loadJs
};

export default JsUtils;