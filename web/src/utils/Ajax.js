/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import MIMETypeUtils from './MIMETypeUtils';

/**
 * ajax
 * @author tengge / https://github.com/tengge1
 * @param {Object} params 参数
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
            typeof callback === 'function' && callback(data);
        }
    };

    if (data === null) { // 不需要POST数据
        xhr.send(null);
        return;
    }

    // 判断是发送表单还是上传文件
    // 由于API Controller只能序列化Content-Type为`application/x-www-form-urlencoded`的数据，所以发送表单和上传文件只能二选一。
    // 否则报错："No MediaTypeFormatter is available to read an object of type 'EditTextureModel' from content with media type 'multipart/form-data'.
    var hasFile = false, name;

    for (name in data) {
        if (data[name] instanceof Blob) {
            hasFile = true;
            break;
        }
    }

    if (hasFile) { // 上传文件
        var formData = new FormData();

        for (name in data) {
            if (data[name] instanceof File) {
                formData.append(name, data[name]);
            } else if (data[name] instanceof Blob) {
                formData.append(name, data[name], `${data[name].name}.${MIMETypeUtils.getExtension(data[name].type)}`);
            }
        }

        xhr.send(formData);
    } else { // 发送表单
        var bodies = [];
        for (name in data) {
            bodies.push(name + '=' + encodeURIComponent(data[name]));
        }

        var body = bodies.join('&');
        if (body.length) {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }

        xhr.send(body);
    }
}

/**
 * get请求
 * @param {String} url 地址
 * @param {Function} callback 回调函数
 */
function get(url, callback) {
    ajax({
        url: url,
        callback: callback
    });
}

/**
 * get请求并解析json数据
 * @param {String} url URL地址
 * @param {Function} callback 回调函数
 */
function getJson(url, callback) {
    ajax({
        url: url,
        callback: function (data) {
            typeof callback === 'function' && callback(JSON.parse(data));
        }
    });
}

/**
 * post请求
 * @param {String} url 地址
 * @param {Object} data 数据
 * @param {Function} callback 回调函数
 */
function post(url, data, callback) {
    const _data = typeof data === 'function' ? null : data;
    const _callback = typeof data === 'function' ? data : callback;

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