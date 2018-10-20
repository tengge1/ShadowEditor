import MIMETypeUtils from './MIMETypeUtils';

/**
 * ajax
 * @author tengge / https://github.com/tengge1
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

    var formData;
    if (data) {
        var hasFile = false;

        formData = new FormData();

        for (var name in data) {
            if (data[name] instanceof Blob) {
                hasFile = true;
                formData.append(name, data[name], `${data[name].name}.${MIMETypeUtils.getExtension(data[name].type)}`);
            } else {
                formData.append(name, encodeURIComponent(data[name]));
            }
        }

        // 不要设置Content-type, 否则文件上传会失败
        // if (hasFile) {
        //     xhr.setRequestHeader('Content-type', 'multipart/form-data');
        // } else {
        //     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // }
    }

    xhr.send(formData);
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