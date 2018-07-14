import Control from '../ui/Control';
import XType from '../ui/XType';

/**
 * 工具栏
 */
function Toolbar(app) {
    this.app = app;
    Control.call(this, { parent: this.app.container });
};

Toolbar.prototype = Object.create(Control.prototype);
Toolbar.prototype.constructor = Toolbar;

Toolbar.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        parent: this.app.container,
        id: 'toolbar',
        children: [{
            xtype: 'iconbutton',
            id: 'selectBtn',
            icon: 'icon-select',
            cls: 'Button IconButton selected',
            title: '选择'
        }, {
            xtype: 'iconbutton',
            id: 'translateBtn',
            icon: 'icon-translate',
            title: '平移(W)'
        }, {
            xtype: 'iconbutton',
            id: 'rotateBtn',
            icon: 'icon-rotate',
            title: '旋转(E)'
        }, {
            xtype: 'iconbutton',
            id: 'scaleBtn',
            icon: 'icon-scale',
            title: '缩放(R)'
        }, {
            xtype: 'iconbutton',
            id: 'deleteBtn',
            icon: 'icon-delete',
            title: '删除'
        }, {
            xtype: 'hr'
        }, {
            xtype: 'iconbutton',
            id: 'modelBtn',
            icon: 'icon-model-view',
            title: '模型'
        }, {
            xtype: 'iconbutton',
            id: 'handBtn',
            icon: 'icon-hand',
            title: '抓手'
        }, {
            xtype: 'iconbutton',
            id: 'anchorPointBtn',
            icon: 'icon-anchor-point',
            title: '添加锚点'
        }, {
            xtype: 'iconbutton',
            id: 'pathBtn',
            icon: 'icon-path',
            title: '绘制路径'
        }]
    };

    var control = XType.create(data);
    control.render();
};

export default Toolbar;