var ID = -1;

/**
 * 播放器组件
 * @param {*} app 播放器
 */
function PlayerComponent(app) {
    this.id = `${this.constructor.name}${ID--}`
    app = app;
}

/**
 * 创建
 * @param {*} scene 
 * @param {*} camera 
 * @param {*} renderer 
 * @param {*} others 
 */
PlayerComponent.prototype.create = function (scene, camera, renderer, others) {
    return new Promise(resolve => {
        resolve();
    });
};

/**
 * 更新
 * @param {*} clock 
 * @param {*} deltaTime 
 */
PlayerComponent.prototype.update = function (clock, deltaTime) {

};

/**
 * 析构
 * @param {*} scene 
 * @param {*} camera 
 * @param {*} renderer 
 * @param {*} others 
 */
PlayerComponent.prototype.dispose = function (scene, camera, renderer, others) {

};

export default PlayerComponent;