/**
 * 场景转json对象
 * @param {*} scene 
 */
function SceneToJson(scene) {
    var _this = this;
    var list = [];
    this.scene.traverse(function (item) {
        list.push(item.toJSON());
    });
    debugger
}

export default SceneToJson;