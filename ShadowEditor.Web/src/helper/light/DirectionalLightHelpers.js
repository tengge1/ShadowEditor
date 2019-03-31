import BaseHelper from '../BaseHelper';
import VolumeDirectionalLightHelper from './VolumeDirectionalLightHelper';

/**
 * 平行光帮助器
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function DirectionalLightHelpers(app) {
    BaseHelper.call(this, app);

    this.helpers = [];
}

DirectionalLightHelpers.prototype = Object.create(BaseHelper.prototype);
DirectionalLightHelpers.prototype.constructor = DirectionalLightHelpers;

DirectionalLightHelpers.prototype.start = function () {
    this.app.on(`objectAdded.${this.id}`, this.onObjectAdded.bind(this));
    this.app.on(`objectRemoved.${this.id}`, this.onObjectRemoved.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
    this.app.on(`storageChanged.${this.id}`, this.onStorageChanged.bind(this));
};

DirectionalLightHelpers.prototype.stop = function () {
    this.app.on(`objectAdded.${this.id}`, null);
    this.app.on(`objectRemoved.${this.id}`, null);
    this.app.on(`objectChanged.${this.id}`, null);
    this.app.on(`storageChanged.${this.id}`, null);
};

DirectionalLightHelpers.prototype.onObjectAdded = function (object) {
    if (!object.isDirectionalLight) {
        return;
    }

    var helper = new VolumeDirectionalLightHelper(object, 1);

    helper.visible = this.app.storage.get('showDirectionalLight');
    
    this.helpers.push(helper);

    this.app.editor.sceneHelpers.add(helper);
};

DirectionalLightHelpers.prototype.onObjectRemoved = function (object) {
    if (!object.isDirectionalLight) {
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

DirectionalLightHelpers.prototype.onObjectChanged = function (object) {
    if (!object.isDirectionalLight) {
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

DirectionalLightHelpers.prototype.onStorageChanged = function (key, value) {
    if (key !== 'showDirectionalLight') {
        return;
    }

    this.helpers.forEach(n => {
        n.visible = value;
    });
};

export default DirectionalLightHelpers;