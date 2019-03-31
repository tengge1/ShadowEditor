import BaseHelper from '../BaseHelper';
import VolumeHemisphereLightHelper from './VolumeHemisphereLightHelper';

/**
 * 半球光帮助器
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function HemisphereLightHelpers(app) {
    BaseHelper.call(this, app);

    this.helpers = [];
}

HemisphereLightHelpers.prototype = Object.create(BaseHelper.prototype);
HemisphereLightHelpers.prototype.constructor = HemisphereLightHelpers;

HemisphereLightHelpers.prototype.start = function () {
    this.app.on(`objectAdded.${this.id}`, this.onObjectAdded.bind(this));
    this.app.on(`objectRemoved.${this.id}`, this.onObjectRemoved.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
    this.app.on(`storageChanged.${this.id}`, this.onStorageChanged.bind(this));
};

HemisphereLightHelpers.prototype.stop = function () {
    this.app.on(`objectAdded.${this.id}`, null);
    this.app.on(`objectRemoved.${this.id}`, null);
    this.app.on(`objectChanged.${this.id}`, null);
    this.app.on(`storageChanged.${this.id}`, null);
};

HemisphereLightHelpers.prototype.onObjectAdded = function (object) {
    if (!object.isHemisphereLight) {
        return;
    }

    var helper = new VolumeHemisphereLightHelper(object, 1);

    helper.visible = this.app.storage.get('showHemisphereLight');

    this.helpers.push(helper);

    this.app.editor.sceneHelpers.add(helper);
};

HemisphereLightHelpers.prototype.onObjectRemoved = function (object) {
    if (!object.isHemisphereLight) {
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

HemisphereLightHelpers.prototype.onObjectChanged = function (object) {
    if (!object.isHemisphereLight) {
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

HemisphereLightHelpers.prototype.onStorageChanged = function (key, value) {
    if (key !== 'showHemisphereLight') {
        return;
    }

    this.helpers.forEach(n => {
        n.visible = value;
    });
};

export default HemisphereLightHelpers;