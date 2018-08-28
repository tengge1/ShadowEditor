var ID = -1;

/**
 * 特效基类
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function BaseEffect(app) {
    this.app = app;
    this.id = `BaseEffect${ID--}`;
};

BaseEffect.prototype.render = function (obj) {

};

export default BaseEffect;