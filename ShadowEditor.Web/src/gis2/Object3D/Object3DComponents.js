/**
* 三维对象集合
*/
function Object3DComponents() {
    this.id = ++ZeroGIS.idCounter;
    this.matrix = new ZeroGIS.Matrix();
    this.visible = true;
    this.parent = null;
    this.children = [];
}

Object3DComponents.prototype.add = function (obj) {
    if (!(obj instanceof ZeroGIS.Object3D || obj instanceof ZeroGIS.Object3DComponents)) {
        throw "invalid obj: not World.Object3D or Object3DComponents";
    }

    if (this.findObjById(obj.id) !== null) {
        console.debug("obj已经存在于Object3DComponents中，无法将其再次加入！");
        return;
    } else {
        this.children.push(obj);
        obj.parent = this;
    }
};

Object3DComponents.prototype.remove = function (obj) {
    if (obj) {
        var result = this.findObjById(obj.id);
        if (result === null) {
            console.debug("obj不存在于Object3DComponents中，所以无法将其从中删除！");
            return false;
        }
        obj.destroy();
        this.children.splice(result.index, 1);
        obj = null;
        return true;
    } else {
        return false;
    }
};

//销毁所有的子节点
Object3DComponents.prototype.clear = function () {
    for (var i = 0; i < this.children.length; i++) {
        var obj = this.children[i];
        obj.destroy();
    }
    this.children = [];
};

//销毁自身及其子节点
Object3DComponents.prototype.destroy = function () {
    this.parent = null;
    this.clear();
};

Object3DComponents.prototype.findObjById = function (objId) {
    for (var i = 0; i < this.children.length; i++) {
        var obj = this.children[i];
        if (obj.id == objId) {
            obj.index = i;
            return obj;
        }
    }
    return null;
};

Object3DComponents.prototype.draw = function (camera) {
    if (!(camera instanceof ZeroGIS.PerspectiveCamera)) {
        throw "invalid camera: not World.PerspectiveCamera";
    }

    for (var i = 0; i < this.children.length; i++) {
        var obj = this.children[i];
        if (obj) {
            if (obj.visible) {
                obj.draw(camera);
            }
        }
    }
};

Object3DComponents.prototype.worldTranslate = function (x, y, z) {
    this.matrix.worldTranslate(x, y, z);
};

Object3DComponents.prototype.localTranslate = function (x, y, z) {
    this.matrix.localTranslate(x, y, z);
};

Object3DComponents.prototype.worldScale = function (scaleX, scaleY, scaleZ) {
    this.matrix.worldScale(scaleX, scaleY, scaleZ);
};

Object3DComponents.prototype.localScale = function (scaleX, scaleY, scaleZ) {
    this.matrix.localScale(scaleX, scaleY, scaleZ);
};

Object3DComponents.prototype.worldRotateX = function (radian) {
    this.matrix.worldRotateX(radian);
};

Object3DComponents.prototype.worldRotateY = function (radian) {
    this.matrix.worldRotateY(radian);
};

Object3DComponents.prototype.worldRotateZ = function (radian) {
    this.matrix.worldRotateZ(radian);
};

Object3DComponents.prototype.worldRotateByVector = function (radian, vector) {
    this.matrix.worldRotateByVector(radian, vector);
};

Object3DComponents.prototype.localRotateX = function (radian) {
    this.matrix.localRotateX(radian);
};

Object3DComponents.prototype.localRotateY = function (radian) {
    this.matrix.localRotateY(radian);
};

Object3DComponents.prototype.localRotateZ = function (radian) {
    this.matrix.localRotateZ(radian);
};

//localVector指的是相对于模型坐标系中的向量
Object3DComponents.prototype.localRotateByVector = function (radian, localVector) {
    this.matrix.localRotateByVector(radian, localVector);
};

export default Object3DComponents;