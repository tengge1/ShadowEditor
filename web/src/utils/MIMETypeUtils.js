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