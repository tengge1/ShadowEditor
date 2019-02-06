import BaseHelper from '../BaseHelper';

/**
 * 曲线帮助器基类
 * @param {*} spline 
 */
function SplineHelper(spline) {
    BaseHelper.call(this, spline);
}

SplineHelper.prototype = Object.create(BaseHelper.prototype);
SplineHelper.prototype.constructor = SplineHelper;

SplineHelper.prototype.update = function () {

};

SplineHelper.prototype.updateObject = function () {

};

export default SplineHelper;