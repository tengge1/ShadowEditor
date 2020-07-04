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
 * @param {DataView2} r 数据视图
 */
function Vertex(r) {
    var self = this,
        i;
    self.position = [r.getFloat(), r.getFloat(), r.getFloat()];
    self.normal = [r.getFloat(), r.getFloat(), r.getFloat(), 0];
    self.u = r.getFloat();
    self.v = r.getFloat();
    self.bones = new Array(4);
    for (i = 0; i < 4; ++i) {
        self.bones[i] = r.getUint8();
    }
    self.weights = new Array(4);
    for (i = 0; i < 4; ++i) {
        self.weights[i] = r.getFloat();
    }
}

export default Vertex;