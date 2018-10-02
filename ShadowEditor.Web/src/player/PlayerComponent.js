var ID = -1;

/**
 * 播放器组件
 * @param {*} app 应用
 */
function PlayerComponent(app) {
    this.id = `PlayerComponent${ID--}`
    this.app = app;
}

/**
 * 初始化
 * @param {*} scene 
 * @param {*} camera 
 * @param {*} renderer 
 * @param {*} others 
 */
PlayerComponent.prototype.init = function (scene, camera, renderer, others) {

};

/**
 * 更新
 * @param {*} clock 
 * @param {*} deltaTime 
 */
PlayerComponent.prototype.update = function (clock, deltaTime) {

};

/**
 * 析构函数
 * @param {*} scene 
 * @param {*} camera 
 * @param {*} renderer 
 * @param {*} others 
 */
PlayerComponent.prototype.dispose = function (scene, camera, renderer, others) {

};

export default PlayerComponent;