import BaseHelper from '../BaseHelper';
import VolumePointLightHelper from './VolumePointLightHelper';

/**
 * 点光源帮助器
 * @param {*} app 
 */
function PointLightHelpers(app) {
    BaseHelper.call(this, app);

    this.helpers = [];
}

PointLightHelpers.prototype = Object.create(BaseHelper.prototype);
PointLightHelpers.prototype.constructor = PointLightHelpers;

PointLightHelpers.prototype.start = function () {
    this.app.on(`objectAdded.${this.id}`, this.onObjectAdded.bind(this));
    this.app.on(`objectRemoved.${this.id}`, this.onObjectRemoved.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
    this.app.on(`storageChanged.${this.id}`, this.onStorageChanged.bind(this));
};

PointLightHelpers.prototype.stop = function () {
    this.app.on(`objectAdded.${this.id}`, null);
    this.app.on(`objectRemoved.${this.id}`, null);
    this.app.on(`objectChanged.${this.id}`, null);
    this.app.on(`storageChanged.${this.id}`, null);
};

PointLightHelpers.prototype.onObjectAdded = function (object) {
    if (!object.isPointLight) {
        return;
    }

    var helper = new VolumePointLightHelper(object, 1);

    helper.visible = this.app.storage.get('showPointLight');

    this.helpers.push(helper);

    this.app.editor.sceneHelpers.add(helper);
};

PointLightHelpers.prototype.onObjectRemoved = function (object) {
    if (!object.isPointLight) {
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

PointLightHelpers.prototype.onObjectChanged = function (object) {
    if (!object.isPointLight) {
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

PointLightHelpers.prototype.onStorageChanged = function (key, value) {
    if (key !== 'showPointLight') {
        return;
    }

    this.helpers.forEach(n => {
        n.visible = value;
    });
};

export default PointLightHelpers;