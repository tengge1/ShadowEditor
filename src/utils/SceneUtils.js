/**
 * 场景转JSON对象
 * @param {*} scene 场景
 */
function toJSON(scene) {
    var list = [];
    scene.traverse(function (item) {
        list.push(item.toJSON());
    });
    return list;
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