import BaseHelper from '../BaseHelper';
import VolumeSpotLightHelper from './VolumeSpotLightHelper';

/**
 * 聚光灯帮助器
 * @param {*} app 
 */
function SpotLightHelpers(app) {
    BaseHelper.call(this, app);

    this.helpers = [];
}

SpotLightHelpers.prototype = Object.create(BaseHelper.prototype);
SpotLightHelpers.prototype.constructor = SpotLightHelpers;

SpotLightHelpers.prototype.start = function () {
    this.app.on(`objectAdded.${this.id}`, this.onObjectAdded.bind(this));
    this.app.on(`objectRemoved.${this.id}`, this.onObjectRemoved.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

SpotLightHelpers.prototype.stop = function () {
    this.app.on(`objectAdded.${this.id}`, null);
    this.app.on(`objectRemoved.${this.id}`, null);
    this.app.on(`objectChanged.${this.id}`, null);
};

SpotLightHelpers.prototype.onObjectAdded = function (object) {
    if (!object.isSpotLight) {
        return;
    }

    var helper = new VolumeSpotLightHelper(object, 0xffffff);

    this.helpers.push(helper);

    this.app.editor.sceneHelpers.add(helper);
};

SpotLightHelpers.prototype.onObjectRemoved = function (object) {
    if (!object.isSpotLight) {
        return;
    }

    var index = this.helpers.findIndex(n => {
        return n.light === object;
    });

    if (index === -1) {
        return;
    }

    this.app.editor.sceneHelpers.remove(this.helpers[index]);

    this.helpers[index].dispose();

    this.helpers.splice(index, 1);
};

SpotLightHelpers.prototype.onObjectChanged = function (object) {
    if (!object.isSpotLight) {
        return;
    }

    var index = this.helpers.findIndex(n => {
        return n.light === object;
    });

    if (index === -1) {
        return;
    }

    this.helpers[index].update();
};

export default SpotLightHelpers;