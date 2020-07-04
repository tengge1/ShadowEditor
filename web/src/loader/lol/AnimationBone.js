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
 * @param {Animation} anim 动画
 * @param {DataView2} r 数据视图
 * @param {Number} version 版本
 */
function AnimationBone(model, anim, r, version) {
    var self = this;
    self.model = model;
    self.anim = anim;
    var numFrames = r.getUint32();
    self.bone = r.getString().toLowerCase();
    self.flags = r.getUint32();
    self.frames = new Array(numFrames);
    var scale = [1, 1, 1];
    for (var i = 0; i < numFrames; ++i) {
        var pos = [r.getFloat(), r.getFloat(), r.getFloat()];
        var rot = [r.getFloat(), r.getFloat(), r.getFloat(), r.getFloat()];
        if (version >= 3) scale = [r.getFloat(), r.getFloat(), r.getFloat()];
        self.frames[i] = {
            pos: pos,
            rot: rot,
            scale: scale
        };
    }
    self.matrix = mat4.create();
    self.tmpMat = mat4.create();
    self.tmpMat2 = mat4.create();
    self.tmpPos = vec3.create();
    self.tmpRot = quat.create();
    self.tmpScale = vec3.create();
}

AnimationBone.prototype.update = function (boneId, frame, r) {
    var self = this;
    self.index = boneId;
    var parent = self.model.bones[boneId].parent;
    var f0 = frame % self.frames.length,
        f1 = (frame + 1) % self.frames.length;
    vec3.lerp(self.tmpPos, self.frames[f0].pos, self.frames[f1].pos, r);
    vec3.lerp(self.tmpScale, self.frames[f0].scale, self.frames[f1].scale, r);
    quat.slerp(self.tmpRot, self.frames[f0].rot, self.frames[f1].rot, r);
    self.translation(self.tmpMat2, self.tmpPos);
    self.rotationQuat(self.tmpMat, self.tmpRot);
    self.mulSlimDX(self.matrix, self.tmpMat, self.tmpMat2);
    if (parent !== -1) {
        self.mulSlimDX(self.matrix, self.matrix, self.model.transforms[parent]);
    }
    mat4.copy(self.model.transforms[boneId], self.matrix);
};

AnimationBone.prototype.translation = function (out, vec) {
    mat4.identity(out);
    out[12] = vec[0];
    out[13] = vec[1];
    out[14] = vec[2];
    return out;
};

AnimationBone.prototype.rotationQuat = function (out, q) {
    mat4.identity(out);
    var xx = q[0] * q[0],
        yy = q[1] * q[1],
        zz = q[2] * q[2],
        xy = q[0] * q[1],
        zw = q[2] * q[3],
        zx = q[2] * q[0],
        yw = q[1] * q[3],
        yz = q[1] * q[2],
        xw = q[0] * q[3];
    out[0] = 1 - 2 * (yy + zz);
    out[1] = 2 * (xy + zw);
    out[2] = 2 * (zx - yw);
    out[4] = 2 * (xy - zw);
    out[5] = 1 - 2 * (zz + xx);
    out[6] = 2 * (yz + xw);
    out[8] = 2 * (zx + yw);
    out[9] = 2 * (yz - xw);
    out[10] = 1 - 2 * (yy + xx);
    return out;
};

AnimationBone.prototype.mulSlimDX = function (out, l, r) {
    var left = {
        M11: l[0],
        M12: l[1],
        M13: l[2],
        M14: l[3],
        M21: l[4],
        M22: l[5],
        M23: l[6],
        M24: l[7],
        M31: l[8],
        M32: l[9],
        M33: l[10],
        M34: l[11],
        M41: l[12],
        M42: l[13],
        M43: l[14],
        M44: l[15]
    };
    var right = {
        M11: r[0],
        M12: r[1],
        M13: r[2],
        M14: r[3],
        M21: r[4],
        M22: r[5],
        M23: r[6],
        M24: r[7],
        M31: r[8],
        M32: r[9],
        M33: r[10],
        M34: r[11],
        M41: r[12],
        M42: r[13],
        M43: r[14],
        M44: r[15]
    };
    out[0] = left.M11 * right.M11 + left.M12 * right.M21 + left.M13 * right.M31 + left.M14 * right.M41;
    out[1] = left.M11 * right.M12 + left.M12 * right.M22 + left.M13 * right.M32 + left.M14 * right.M42;
    out[2] = left.M11 * right.M13 + left.M12 * right.M23 + left.M13 * right.M33 + left.M14 * right.M43;
    out[3] = left.M11 * right.M14 + left.M12 * right.M24 + left.M13 * right.M34 + left.M14 * right.M44;
    out[4] = left.M21 * right.M11 + left.M22 * right.M21 + left.M23 * right.M31 + left.M24 * right.M41;
    out[5] = left.M21 * right.M12 + left.M22 * right.M22 + left.M23 * right.M32 + left.M24 * right.M42;
    out[6] = left.M21 * right.M13 + left.M22 * right.M23 + left.M23 * right.M33 + left.M24 * right.M43;
    out[7] = left.M21 * right.M14 + left.M22 * right.M24 + left.M23 * right.M34 + left.M24 * right.M44;
    out[8] = left.M31 * right.M11 + left.M32 * right.M21 + left.M33 * right.M31 + left.M34 * right.M41;
    out[9] = left.M31 * right.M12 + left.M32 * right.M22 + left.M33 * right.M32 + left.M34 * right.M42;
    out[10] = left.M31 * right.M13 + left.M32 * right.M23 + left.M33 * right.M33 + left.M34 * right.M43;
    out[11] = left.M31 * right.M14 + left.M32 * right.M24 + left.M33 * right.M34 + left.M34 * right.M44;
    out[12] = left.M41 * right.M11 + left.M42 * right.M21 + left.M43 * right.M31 + left.M44 * right.M41;
    out[13] = left.M41 * right.M12 + left.M42 * right.M22 + left.M43 * right.M32 + left.M44 * right.M42;
    out[14] = left.M41 * right.M13 + left.M42 * right.M23 + left.M43 * right.M33 + left.M44 * right.M43;
    out[15] = left.M41 * right.M14 + left.M42 * right.M24 + left.M43 * right.M34 + left.M44 * right.M44;
    return out;
};

export default AnimationBone;