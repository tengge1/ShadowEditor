import BaseHelper from './BaseHelper';

/**
 * 选择帮助器
 * @param {*} app 
 */
function SelectHelper(app) {
    BaseHelper.call(this, app);
}

SelectHelper.prototype = Object.create(BaseHelper.prototype);
SelectHelper.prototype.constructor = SelectHelper;

SelectHelper.prototype.start = function () {
    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

SelectHelper.prototype.stop = function () {
    this.app.on(`objectSelected.${this.id}`, null);
    this.app.on(`objectChanged.${this.id}`, null);
};

SelectHelper.prototype.onObjectSelected = function (obj) {
    if (this.helper === undefined) {
        this.helper = new THREE.BoxHelper();
        this.helper.visible = false;
        this.app.editor.sceneHelpers.add(this.helper);
    }

    if (obj) {
        this.object = obj;
        this.helper.setFromObject(obj);
        this.helper.visible = true;
    } else {
        delete this.object;
        this.helper.setFromObject(undefined);
        this.helper.visible = false;
    }
};

SelectHelper.prototype.onObjectChanged = function (obj) {
    if (this.object && this.helper && this.object === obj) {
        this.helper.update();
    }
};

export default SelectHelper;