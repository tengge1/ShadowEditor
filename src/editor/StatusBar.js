import Control from '../ui/Control';
import XType from '../ui/XType';

/**
 * 状态栏
 * @author mrdoob / http://mrdoob.com/
 */
function StatusBar(app) {
    this.app = app;
    Control.call(this, { parent: this.app.container });
};

StatusBar.prototype = Object.create(Control.prototype);
StatusBar.prototype.constructor = StatusBar;

StatusBar.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        parent: this.app.container,
        id: 'statusBar',
        children: [{
            xtype: 'div',
            cls: 'wrap',
            children: [{
                xtype: 'button',
                id: 'translateBtn',
                text: '平移',
                cls: 'Button selected',
                title: 'W',
                onClick: function () {
                    _this.app.call('transformModeChanged', _this, 'translate');
                }
            }, {
                xtype: 'button',
                id: 'rotateBtn',
                text: '旋转',
                title: 'E',
                onClick: function () {
                    _this.app.call('transformModeChanged', _this, 'rotate');
                }
            }, {
                xtype: 'button',
                id: 'scaleBtn',
                text: '缩放',
                title: 'R',
                onClick: function () {
                    _this.app.call('transformModeChanged', _this, 'scale');
                }
            }, {
                xtype: 'label',
                text: '网格：'
            }, {
                id: 'grid',
                xtype: 'number',
                value: 25, // 网格数量
                onChange: function () {
                    _this.app.call('gridChange', _this, this);
                }
            }, {
                id: 'snap',
                xtype: 'boolean',
                value: false, // 对齐网格
                text: '单元',
                onChange: function () {
                    _this.app.call('gridChange', _this, this);
                }
            }, {
                id: 'local',
                xtype: 'boolean',
                value: false, // 坐标系
                text: '本地',
                onChange: function () {
                    _this.app.call('gridChange', _this, this);
                }
            }, {
                id: 'showGrid',
                xtype: 'boolean',
                value: true,
                text: '网格', // 显示/隐藏网格
                onChange: function () {
                    _this.app.call('gridChange', _this, this);
                }
            }]
        }]
    };

    var control = XType.create(data);
    control.render();

    this.grid = XType.getControl('grid');
    this.snap = XType.getControl('snap');
    this.local = XType.getControl('local');
    this.showGrid = XType.getControl('showGrid');
};

export default StatusBar;