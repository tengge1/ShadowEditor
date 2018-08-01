/**
 * ajax
 * @param {*} params 参数
 */
function ajax(params) {
    const url = params.url || '';
    const method = params.method || 'GET';
    const data = params.data || null;
    const callback = params.callback || null;

    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var data = xhr.responseText;
            typeof (callback) === 'function' && callback(data);
        }
    }

    var body;
    if (data) {
        var bodies = [];
        for (var name in data) {
            bodies.push(name + '=' + encodeURIComponent(data[name]));
        }

        body = bodies.join('&');
        if (body.length) {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
    }

    xhr.send(body);
}

/**
 * get请求
 * @param {*} url 地址
 * @param {*} callback 回调函数
 */
function get(url, callback) {
    ajax({
        url: url,
        callback: callback
    });
}

/**
 * get请求并解析json数据
 * @param {*} url 
 * @param {*} callback 
 */
function getJson(url, callback) {
    ajax({
        url: url,
        callback: function (data) {
            typeof (callback) === 'function' && callback(JSON.parse(data));
        }
    })
}

/**
 * post请求
 * @param {*} url 地址
 * @param {*} data 数据
 * @param {*} callback 回调函数
 */
function post(url, data, callback) {
    const _data = typeof (data) === 'function' ? null : data;
    const _callback = typeof (data) === 'function' ? data : callback;

    ajax({
        url: url,
        method: 'POST',
        data: _data,
        callback: _callback
    });
}

/**
 * Ajax
 */
const Ajax = {
    ajax: ajax,
    get: get,
    getJson: getJson,
    post: post
};

export default Ajax;