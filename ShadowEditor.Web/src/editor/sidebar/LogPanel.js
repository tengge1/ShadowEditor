import UI from '../../ui/UI';

/**
 * 日志面板
 * @author tengge / https://github.com/tengge1
 */
function LogPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

LogPanel.prototype = Object.create(UI.Control.prototype);
LogPanel.prototype.constructor = LogPanel;

LogPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'Panel',
        style: {
            position: 'relative'
        },
        children: [{
            xtype: 'button',
            text: '清空',
            onClick: this.onClearLog.bind(this)
        }, {
            xtype: 'br'
        }, {
            xtype: 'div',
            style: {
                height: this.app.container.clientHeight - 160 + 'px',
                marginTop: '8px',
                backgroundColor: '#fff',
                overflowY: 'auto'
            },
            id: 'logContent'
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`log.${this.id}`, this.onLog.bind(this));
};

LogPanel.prototype.onLog = function (content, type) {
    var dom = UI.get('logContent').dom;

    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;

    content = `<span style="font-weight: bold; margin-right: 8px">${hour}:${minute}:${second}</span>${content}`;

    var box = document.createElement('div');
    box.innerHTML = content;

    if (dom.children.length === 0) {
        dom.appendChild(box);
    } else {
        dom.insertBefore(box, dom.children[0]);
    }

    if (type === 'warn') {
        box.style.backgroundColor = '#fffbe5';
        box.style.color = '#5c3c00';
    } else if (type === 'error') {
        box.style.backgroundColor = '#fff0f0';
        box.style.color = '#ff0000';
    }
};

LogPanel.prototype.onClearLog = function () {
    var dom = UI.get('logContent').dom;
    dom.innerHTML = '';
    this.onLog('清空日志');
};

export default LogPanel;