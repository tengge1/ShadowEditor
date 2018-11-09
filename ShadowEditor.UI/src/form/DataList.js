import { Control, UI } from '../third_party';

/**
 * DataList
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function DataList(options = {}) {
    Control.call(this, options);
}

DataList.prototype = Object.create(Control.prototype);
DataList.prototype.constructor = DataList;

DataList.prototype.render = function () {
    this.renderDom(this.createElement('datalist'));
};

UI.addXType('datalist', DataList);

export default DataList;