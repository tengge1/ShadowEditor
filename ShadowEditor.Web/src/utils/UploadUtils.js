/**
 * 文件上传器
 * @author tengge / https://github.com/tengge1
 */
function Uploader() {

}

/**
 * 上传文件
 * @param {*} input_id 文件input的id
 * @param {*} url 后台接收上传文件url
 * @param {*} onload 上传完成回调函数
 * @param {*} onerror 上传出错回调函数
 * @param {*} onprogress 上传过程回调函数
 */
Uploader.prototype.upload = function (input_id, url, onload, onerror, onprogress) {
    var fileObj = document.getElementById(input_id).files[0];

    var form = new FormData();
    form.append("file", fileObj);

    var xhr = new XMLHttpRequest();
    xhr.open("post", url, true);
    xhr.onload = onload;
    xhr.onerror = onerror;
    xhr.upload.onprogress = onprogress;
    xhr.send(form);
};

const uploader = new Uploader();

/**
 * 上传工具类
 */
const UploadUtils = {
    upload: uploader.upload
};

export default UploadUtils;