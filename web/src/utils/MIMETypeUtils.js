/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * 获取MIME-Type后缀名
 * @param {String} mimeType MIME-Type
 * @returns {String} 文件名后缀
 */
function getExtension(mimeType) {
    switch (mimeType) {
        case 'image/jpeg':
            return 'jpg';
        case 'image/png':
            return 'png';
        case 'image/gif':
            return 'gif';
        case 'image/bmp':
            return 'bmp';
        default:
            console.error(`MIMETypeUtils: unknown MIME-Type: ${mimeType}`);
            return 'unknown';
    }
}

/**
 * 获取MIME-Type类型
 * @param {String} extension 文件名后缀
 * @returns {String} MIME-Type
 */
function getMIMEType(extension) {
    extension = extension.trimLeft('.');
    switch (extension.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'bmp':
            return 'image/bmp';
        default:
            console.warn(`MIMETypeUtils: unknown extension ${extension}.`);
            return 'application/octet-stream';
    }
}

/**
 * MIME-Type工具类
 */
const MIMETypeUtils = {
    getExtension: getExtension,
    getMIMEType: getMIMEType
};

export default MIMETypeUtils;