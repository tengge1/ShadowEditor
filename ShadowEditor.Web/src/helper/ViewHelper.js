import BaseHelper from './BaseHelper';

/**
 * 视角帮助器
 * @param {*} camera 相机
 */
function ViewHelper(camera) {
    BaseHelper.call(this, camera);
}

ViewHelper.prototype = Object.create(BaseHelper.prototype);
ViewHelper.prototype.constructor = ViewHelper;

ViewHelper.prototype.update = function () {

};

export default ViewHelper;