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
 * canvas转DataURL
 * @author cuixiping / https://blog.csdn.net/cuixiping/article/details/45932793
 * @param {HTMLCanvasElement} canvas 画布
 * @param {String} type 图片类型 image/png或image/jpeg
 * @param {Number} quality jpeg图片质量
 * @returns {String} DataURL数据
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
 * @author cuixiping / https://blog.csdn.net/cuixiping/article/details/45932793
 * @param {Blob} blob Blob对象
 * @returns {Promise} DataURL数据
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
 * @author cuixiping / https://blog.csdn.net/cuixiping/article/details/45932793
 * @param {File} file 文件
 * @returns {Promise} DataURL数据
 */
function fileToDataURL(file) {
    return blobToDataURL(file);
}

/**
 * DataURL转Blob
 * @author cuixiping / https://blog.csdn.net/cuixiping/article/details/45932793
 * @param {String} dataURL DataURL数据
 * @returns {Blob} Blob对象
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
 * @author cuixiping / https://blog.csdn.net/cuixiping/article/details/45932793
 * @param {String} dataURL DataURL数据
 * @param {String} filename 文件名
 * @returns {File} 文件
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

    if (mimeType === 'image/jpeg') {
        filename = filename + '.jpg';
    } else if (mimeType === 'image/png') {
        filename = filename + '.png';
    } else {
        console.warn(`Converter: not supported mime-type: ${mimeType}.`);
    }

    return new File([uint8Array], filename, { type: mimeType });
}

/**
 * DataURL转图片
 * @author cuixiping / https://blog.csdn.net/cuixiping/article/details/45932793
 * @param {String} dataURL DataURL数据
 * @returns {Image} 图片
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
 * @author cuixiping / https://blog.csdn.net/cuixiping/article/details/45932793
 * @param {Blob} blob Blob对象
 * @returns {Promise} 图片
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
 * @author cuixiping / https://blog.csdn.net/cuixiping/article/details/45932793
 * @param {File} file 文件
 * @returns {Image} 图片
 */
function FileToImage(file) {
    return BlobToImage(file);
}

/**
 * 图片转画布
 * @author cuixiping / https://blog.csdn.net/cuixiping/article/details/45932793
 * @param {Image} image 图片
 * @returns {HTMLCanvasElement} 画布
 */
function ImageToCanvas(image) {
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    return canvas;
}

/**
 * 画布转图片
 * @param {HTMLCanvasElement} canvas 画布
 * @param {String} type 类型
 * @param {Number} quality jpeg图片质量
 * @returns {Image} 图片
 */
function CanvasToImage(canvas, type = 'image/png', quality = 0.8) {
    var image = new Image();
    if (type === 'image/jpeg') {
        image.src = canvas.toDataURL('image/jpeg', quality);
    } else {
        image.src = canvas.toDataURL('image/png');
    }
    return image;
}

/**
 * 类型转换工具
 * @author tengge / https://github.com/tengge1
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
    imageToCanvas: ImageToCanvas,
    canvasToImage: CanvasToImage
};

export default Converter;