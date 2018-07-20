import UI from '../ui/UI';

/**
 * 状态栏
 * @author mrdoob / http://mrdoob.com/
 */
function StatusBar(app) {
    this.app = app;
    UI.Control.call(this, { parent: this.app.container });
};

StatusBar.prototype = Object.create(UI.Control.prototype);
StatusBar.prototype.constructor = StatusBar;

StatusBar.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        parent: this.app.container,
        id: 'statusBar',
        children: [{
            xtype: 'label',
            text: '物体'
        }, {
            xtype: 'text',
            id: 'objectsText',
            text: '0' // 物体数
        }, {
            xtype: 'label',
            text: '顶点'
        }, {
            xtype: 'text',
            id: 'verticesText',
            text: '0' // 顶点数
        }, {
            xtype: 'label',
            text: '三角形'
        }, {
            xtype: 'text',
            id: 'trianglesText',
            text: '0' // 三角形数
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default StatusBar;