/**
 * 场景转JSON对象
 * @param {*} scene 场景
 */
function toJSON(scene) {
    var list = [];
    var _this = this;
    scene.traverse(function (item) {
        list.push(_this.parseObject(item));
    });
    return list;
};

toJSON.prototype.parseObject = function (item) {

};

/**
 * JSON对象转场景
 * @param {*} obj JSON对象
 */
function fromJSON(obj) {

}

/**
 * 场景工具
 */
const SceneUtils = {
    toJSON: toJSON,
    fromJSON: fromJSON
};

export default SceneUtils;