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

    this.cls = options.cls || 'Table';
    this.style = options.style || null;
}

DataTable.prototype = Object.create(Control.prototype);
DataTable.prototype.constructor = DataTable;

DataTable.prototype.render = function () {
    this.dom = document.createElement('div');
    this.parent.appendChild(this.dom);

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    // 表格头
    this.head = document.createElement('table');
    this.head.className = 'head';
    this.dom.appendChild(this.head);

    var tr = document.createElement('tr');

    this.cols.forEach(n => {
        var th = document.createElement('th');
        th.innerHTML = n.title || '';
        tr.appendChild(th);
    });

    this.head.appendChild(tr);

    // 表格体
    this.body = document.createElement('table');
    this.body.className = 'body';
    this.dom.appendChild(this.body);

    this.rows.forEach(n => {
        var tr = document.createElement('tr');

        this.cols.forEach(m => {
            var td = document.createElement('td');

            if (n[m.field]) {
                td.innerHTML = n[m.field];
            }

            tr.appendChild(td);
        });

        this.body.appendChild(tr);
    });
};

export default DataTable;