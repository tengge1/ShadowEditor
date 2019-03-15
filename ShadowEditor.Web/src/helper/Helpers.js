import BaseHelper from './BaseHelper';

import GridHelper from './GridHelper';
import CameraHelper from './CameraHelper';

import ViewHelper from './ViewHelper';
import SelectHelper from './SelectHelper';
import SplineHelper from './line/SplineHelper';

/**
 * 所有帮助器
 * @param {*} app 
 */
function Helpers(app) {
    BaseHelper.call(this, app);

    this.helpers = [
        new GridHelper(app),
        new CameraHelper(app),

        new SelectHelper(app),
        new ViewHelper(app),
        new SplineHelper(app),
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