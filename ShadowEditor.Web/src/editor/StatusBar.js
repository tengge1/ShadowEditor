import UI from '../ui/UI';

/**
 * 状态栏
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function StatusBar(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

StatusBar.prototype = Object.create(UI.Control.prototype);
StatusBar.prototype.constructor = StatusBar;

StatusBar.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        id: 'statusBar',
        parent: this.app.container,
        cls: 'statusBar',
        children: [{
            xtype: 'row',
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
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default StatusBar;