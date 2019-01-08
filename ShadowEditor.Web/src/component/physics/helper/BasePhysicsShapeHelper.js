var ID = -1;

/**
 * 基本物理形状帮助器
 * @param {*} app 
 */
function BasePhysicsShapeHelper(app) {
    this.app = app;
    this.id = `${this.constructor.name}${ID--}`;
};

BasePhysicsShapeHelper.prototype.create = function () {

};

BasePhysicsShapeHelper.prototype.update = function () {

};

BasePhysicsShapeHelper.prototype.dispose = function () {

};

export default BasePhysicsShapeHelper;