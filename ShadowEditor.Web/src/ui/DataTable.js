import Control from './Control';

/**
 * 数据表格
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function DataTable(options = {}) {
    Control.call(this, options);

    this.cols = options.cols || [];
    this.rows = options.rows || [];
}

DataTable.prototype = Object.create(Control.prototype);
DataTable.prototype.constructor = DataTable;

DataTable.prototype.render = function () {
    this.dom = document.createElement('div');

    this.header = document.createElement('table');
    this.dom.appendChild(this.header);

    this.body = document.createElement('table');
    this.dom.appendChild(this.body);
};

export default DataTable;