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
class DataView2 {
    constructor(buffer) {
        this.buffer = new DataView(buffer);
        this.position = 0;
    }

    getBool() {
        var v = this.buffer.getUint8(this.position) !== 0;
        this.position += 1;
        return v;
    }

    getUint8() {
        var v = this.buffer.getUint8(this.position);
        this.position += 1;
        return v;
    }

    getInt8() {
        var v = this.buffer.getInt8(this.position);
        this.position += 1;
        return v;
    }

    getUint16() {
        var v = this.buffer.getUint16(this.position, true);
        this.position += 2;
        return v;
    }

    getInt16() {
        var v = this.buffer.getInt16(this.position, true);
        this.position += 2;
        return v;
    }

    getUint32() {
        var v = this.buffer.getUint32(this.position, true);
        this.position += 4;
        return v;
    }

    getInt32() {
        var v = this.buffer.getInt32(this.position, true);
        this.position += 4;
        return v;
    }

    getFloat() {
        var v = this.buffer.getFloat32(this.position, true);
        this.position += 4;
        return v;
    }

    getString(len) {
        if (len === undefined) len = this.getUint16();
        var str = "";
        for (var i = 0; i < len; ++i) {
            str += String.fromCharCode(this.getUint8());
        }
        return str;
    }

    setBool(v) {
        this.buffer.setUint8(this.position, v ? 1 : 0);
        this.position += 1;
    }

    setUint8(v) {
        this.buffer.setUint8(this.position, v);
        this.position += 1;
    }

    setInt8(v) {
        this.buffer.setInt8(this.position, v);
        this.position += 1;
    }

    setUint16(v) {
        this.buffer.setUint16(this.position, v, true);
        this.position += 2;
    }

    setInt16(v) {
        this.buffer.setInt16(this.position, v, true);
        this.position += 2;
    }

    setUint32(v) {
        this.buffer.setUint32(this.position, v, true);
        this.position += 4;
    }

    setInt32(v) {
        this.buffer.setInt32(this.position, v, true);
        this.position += 4;
    }

    setFloat(v) {
        this.buffer.setFloat32(this.position, v, true);
        this.position += 4;
    }
}

export default DataView2;