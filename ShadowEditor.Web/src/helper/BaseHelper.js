var ID = -1;

/**
 * 帮助器基类
 * @author tengge / https://github.com/tengge1
 */
function BaseHelper(app) {
    this.app = app;
    this.id = `${this.constructor.name}${ID--}`;
}

BaseHelper.prototype.start = function () {

};

BaseHelper.prototype.stop = function () {

};

export default BaseHelper;