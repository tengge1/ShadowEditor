import { Control, UI } from '../third_party';

/**
 * Table
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Table(options = {}) {
    Control.call(this, options);
}

Table.prototype = Object.create(Control.prototype);
Table.prototype.constructor = Table;

Table.prototype.render = function () {
    this.renderDom(this.createElement('table'));
};

UI.addXType('table', Table);

export default Table;