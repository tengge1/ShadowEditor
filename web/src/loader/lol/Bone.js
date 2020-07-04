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
 * @param {Model} model 模型
 * @param {Number} index 索引
 * @param {DataView2} r 数据视图
 */
function Bone(model, index, r) {
    var self = this,
        i;
    self.model = model;
    self.index = index;
    self.name = r.getString().toLowerCase();
    self.parent = r.getInt32();
    self.scale = r.getFloat();
    self.origMatrix = mat4.create();
    for (i = 0; i < 16; ++i) self.origMatrix[i] = r.getFloat();
    self.baseMatrix = mat4.clone(self.origMatrix);
    mat4.transpose(self.baseMatrix, self.baseMatrix);
    mat4.invert(self.baseMatrix, self.baseMatrix);
    mat4.transpose(self.origMatrix, self.origMatrix);
    self.incrMatrix = mat4.create();
    if (model.version >= 2) {
        for (i = 0; i < 16; ++i) self.incrMatrix[i] = r.getFloat();
        mat4.transpose(self.incrMatrix, self.incrMatrix);
    } else {
        mat4.identity(self.incrMatrix);
    }
}

export default Bone;