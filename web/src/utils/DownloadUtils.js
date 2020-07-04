/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
function fakeClick(obj) {
    let ev = document.createEvent('MouseEvents');
    ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    obj.dispatchEvent(ev);
}

/**
 * 下载工具
 * @author tengge / https://github.com/tengge1
 */
const DownloadUtils = {
    download: function (blobParts = [], options = { 'type': 'application/octet-stream' }, fileName = 'NoName') {
        let urlObject = window.URL || window.webkitURL || window;

        let blob = new Blob(blobParts, options);

        let link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');

        link.href = urlObject.createObjectURL(blob);

        link.download = fileName;

        fakeClick(link);
    }
};

export default DownloadUtils;