/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import AnimationBone from './AnimationBone';

/**
 * @author lolking / http://www.lolking.net/models
 * @author tengge / https://github.com/tengge1
 * @param {Model} model 模型
 * @param {DataView2} r 数据视图
 * @param {Number} version 版本
 */
function Animation(model, r, version) {
    var self = this,
        i;
    self.model = model;
    self.meshOverride = {};
    self.name = r.getString().toLowerCase();
    self.fps = r.getInt32();
    var numBones = r.getUint32();
    self.bones = new Array(numBones);
    self.lookup = {};
    for (i = 0; i < numBones; ++i) {
        self.bones[i] = new AnimationBone(model, self, r, version);
        self.lookup[self.bones[i].bone] = i;
    }
    if (numBones === 0 || self.fps <= 1) {
        self.duration = 1e3;
    } else {
        self.duration = Math.floor(1e3 * (self.bones[0].frames.length / self.fps));
    }
}

export default Animation;