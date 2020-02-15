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