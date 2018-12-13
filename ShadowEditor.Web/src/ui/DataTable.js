import Control from './Control';

/**
 * 数据表格
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function DataTable(options = {}) {
    Control.call(this, options);

    this.cols = options.cols || []; // 结构： { field: 'name', title: '姓名', width: 100 }
    this.rows = options.rows || []; // 结构： { name: '小明', age: 18 }

    this.url = options.url || null; // 返回数据格式：{ total: 100, rows: [{ name: '小明', age: 18 }, ...] }

    this.cls = options.cls || 'Table';
    this.style = options.style || null;

    this.selected = null;
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

    // 计算列的总宽度
    this.totalWidth = 0;

    this.cols.forEach(n => {
        this.totalWidth += n.width || 100;
    });

    // 表格头
    this.head = document.createElement('table');
    this.head.className = 'head';
    this.dom.appendChild(this.head);

    var tr = document.createElement('tr');

    var th = document.createElement('th'); // 序号列
    th.innerHTML = '#';
    Object.assign(th.style, {
        width: '60px',
        textAlign: 'center'
    });
    tr.appendChild(th);

    this.cols.forEach(n => { // 数据列
        var th = document.createElement('th');
        th.innerHTML = n.title || '&nbsp;';
        Object.assign(th.style, {
            width: `${this.dom.clientWidth / this.totalWidth * (n.width || 100)}px`
        });
        tr.appendChild(th);
    });

    this.head.appendChild(tr);

    this.reload();
};

DataTable.prototype.reload = function () {
    this.clear();

    if (this.url) {
        fetch(url).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    this.rows = json.rows;
                    this._renderData();
                });
            }
        });
    } else {
        this._renderData();
    }
};

DataTable.prototype._renderData = function () {
    // 表格体
    this.body = document.createElement('table');
    this.body.className = 'body';
    this.dom.appendChild(this.body);

    if (!this.rows) {
        return;
    }

    this.rows.forEach((n, i) => {
        var tr = document.createElement('tr');

        var td = document.createElement('td'); // 序号列
        td.innerHTML = `${i + 1}`;
        Object.assign(td.style, {
            width: '60px',
            textAlign: 'center'
        });
        tr.appendChild(td);

        this.cols.forEach(m => { // 数据列
            var td = document.createElement('td');

            if (n[m.field]) {
                td.innerHTML = n[m.field];
            }

            Object.assign(td.style, {
                width: `${this.dom.clientWidth / this.totalWidth * (n.width || 100)}px`
            });

            tr.appendChild(td);
        });

        tr.setAttribute('data-index', i);

        tr.addEventListener('click', this._clickRow.bind(this));

        this.body.appendChild(tr);
    });
};

DataTable.prototype._clickRow = function (event) {
    var tr = event.target.parentNode;
    var index = tr.getAttribute('data-index'); // tr
    this.selected = this.rows[index];

    var tds = tr.parentNode.children;

    for (var i = 0; i < tds.length; i++) {
        Object.assign(tds[i].style, {
            backgroundColor: '',
            color: ''
        });
    }

    Object.assign(tds[index].style, {
        backgroundColor: '#08f',
        color: '#fff'
    });
};

DataTable.prototype.getSelected = function () {
    return this.selected;
};

DataTable.prototype.clear = function () {
    if (!this.body) {
        return;
    }

    var body = this.body;

    while (body.children.length) {
        var tr = body.children[0];
        tr.removeEventListener('click', this._clickRow);
        body.removeChild(tr);
    }

    this.dom.removeChild(body);

    this.body = null;
    this.selected = null;
};

export default DataTable;