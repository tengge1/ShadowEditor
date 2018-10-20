/**
 * 类型转换工具
 * @author cuixiping / https://blog.csdn.net/cuixiping/article/details/45932793
 */

/**
 * canvas转DataURL
 * @param {*} canvas 画布
 * @param {*} type 图片类型 image/png或image/jpeg
 * @param {*} quality jpeg图片质量
 */
function canvasToDataURL(canvas, type = 'image/png', quality = 0.8) {
    if (type.toLowerCase() === 'image/png') {
        return canvas.toDataURL(type);
    } else {
        return canvas.toDataURL(type, quality);
    }
}

/**
 * Blob转DataURL
 * @param {*} blob Blob对象
 */
function blobToDataURL(blob) {
    var reader = new FileReader();

    return new Promise(resolve => {
        reader.onload = e => {
            resolve(e.target.result);
        };
        reader.readAsDataURL(blob);
    });
}

/**
 * 文件转DataURL
 * @param {*} file 文件
 */
function fileToDataURL(file) {
    return blobToDataURL(file);
}

/**
 * DataURL转Blob
 * @param {*} dataURL 
 */
function dataURLToBlob(dataURL) {
    var array = dataURL.split(',');
    var mimeType = array[0].match(/:(.*?);/)[1];
    var binaryString = atob(array[1]);
    var length = binaryString.length;
    var uint8Array = new Uint8Array(length);
    while (length--) {
        uint8Array[length] = binaryString.charCodeAt(length);
    }
    return new Blob([uint8Array], { type: mimeType });
}

/**
 * DataURL转File
 * @param {*} dataURL 
 * @param {*} filename 文件名
 */
function dataURLtoFile(dataURL, filename) {
    var array = dataURL.split(',');
    var mimeType = array[0].match(/:(.*?);/)[1];
    var binaryString = atob(array[1]);
    var length = binaryString.length;
    var uint8Array = new Uint8Array(length);
    while (length--) {
        uint8Array[length] = binaryString.charCodeAt(length);
    }
    return new File([uint8Array], filename, { type: mimeType });
}

/**
 * DataURL转图片
 * @param {*} dataURL 
 */
function dataURLToImage(dataURL) {
    var image = new Image();

    return new Promise(resolve => {
        image.onload = () => {
            image.onload = null;
            image.onerror = null;
            resolve(image);
        };
        image.onerror = () => {
            image.onload = null;
            image.onerror = null;
            resolve(null);
        };
        image.src = dataURL;
    });
}

/**
 * Blob转图片
 * @param {*} blob 
 */
function BlobToImage(blob) {
    return new Promise(resolve => {
        blobToDataURL(blob).then(dataURL => {
            dataURLToImage(dataURL).then(image => {
                resolve(image);
            });
        });
    });
}

/**
 * 文件转图片
 * @param {*} file 文件
 */
function FileToImage(file) {
    return BlobToImage(file);
}

/**
 * 类型转换工具
 * @author cuixiping / https://blog.csdn.net/cuixiping/article/details/45932793
 */
const Converter = {
    canvasToDataURL: canvasToDataURL,
    blobToDataURL: blobToDataURL,
    fileToDataURL: fileToDataURL,
    dataURLToBlob: dataURLToBlob,
    dataURLtoFile: dataURLtoFile,
    dataURLToImage: dataURLToImage,
    BlobToImage: BlobToImage,
    FileToImage: FileToImage,
};

export default Converter;