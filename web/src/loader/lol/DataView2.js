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
 * @author lolking / http://www.lolking.net/models
 * @author tengge / https://github.com/tengge1
 * @param {ArrayBuffer} buffer 缓冲区
 */
function DataView2(buffer) {
    this.buffer = new DataView(buffer);
    this.position = 0;
}

DataView2.prototype.getBool = function () {
    var v = this.buffer.getUint8(this.position) !== 0;
    this.position += 1;
    return v;
};

DataView2.prototype.getUint8 = function () {
    var v = this.buffer.getUint8(this.position);
    this.position += 1;
    return v;
};

DataView2.prototype.getInt8 = function () {
    var v = this.buffer.getInt8(this.position);
    this.position += 1;
    return v;
};

DataView2.prototype.getUint16 = function () {
    var v = this.buffer.getUint16(this.position, true);
    this.position += 2;
    return v;
};

DataView2.prototype.getInt16 = function () {
    var v = this.buffer.getInt16(this.position, true);
    this.position += 2;
    return v;
};

DataView2.prototype.getUint32 = function () {
    var v = this.buffer.getUint32(this.position, true);
    this.position += 4;
    return v;
};

DataView2.prototype.getInt32 = function () {
    var v = this.buffer.getInt32(this.position, true);
    this.position += 4;
    return v;
};

DataView2.prototype.getFloat = function () {
    var v = this.buffer.getFloat32(this.position, true);
    this.position += 4;
    return v;
};

DataView2.prototype.getString = function (len) {
    if (len === undefined) len = this.getUint16();
    var str = "";
    for (var i = 0; i < len; ++i) {
        str += String.fromCharCode(this.getUint8());
    }
    return str;
};

DataView2.prototype.setBool = function (v) {
    this.buffer.setUint8(this.position, v ? 1 : 0);
    this.position += 1;
};

DataView2.prototype.setUint8 = function (v) {
    this.buffer.setUint8(this.position, v);
    this.position += 1;
};

DataView2.prototype.setInt8 = function (v) {
    this.buffer.setInt8(this.position, v);
    this.position += 1;
};

DataView2.prototype.setUint16 = function (v) {
    this.buffer.setUint16(this.position, v, true);
    this.position += 2;
};

DataView2.prototype.setInt16 = function (v) {
    this.buffer.setInt16(this.position, v, true);
    this.position += 2;
};

DataView2.prototype.setUint32 = function (v) {
    this.buffer.setUint32(this.position, v, true);
    this.position += 4;
};

DataView2.prototype.setInt32 = function (v) {
    this.buffer.setInt32(this.position, v, true);
    this.position += 4;
};

DataView2.prototype.setFloat = function (v) {
    this.buffer.setFloat32(this.position, v, true);
    this.position += 4;
};

export default DataView2;