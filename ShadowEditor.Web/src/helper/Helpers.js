import BaseHelper from './BaseHelper';
import ViewHelper from './ViewHelper';

/**
 * 所有帮助器
 * @param {*} app 
 */
function Helpers(app) {
    BaseHelper.call(this, app);

    this.helpers = [
        new ViewHelper(app),
    ];
}

Helpers.prototype = Object.create(BaseHelper.prototype);
Helpers.prototype.constructor = Helpers;

Helpers.prototype.start = function () {
    this.helpers.forEach(n => {
        n.start();
    });
};

Helpers.prototype.stop = function () {
    this.helpers.forEach(n => {
        n.stop();
    });
};

export default Helpers;