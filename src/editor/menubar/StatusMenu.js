import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 状态菜单（菜单栏右侧）
 * @param {*} options 
 */
function StatusMenu(options) {
    Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

StatusMenu.prototype = Object.create(Control.prototype);
StatusMenu.prototype.constructor = StatusMenu;

StatusMenu.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        id: 'mStatus',
        cls: 'menu right',
        children: [{
            id: 'bAutoSave',
            xtype: 'boolean',
            text: '自动保存',
            value: this.app.editor.config.getKey('autosave'),
            style: 'color: #888 !important;',
            onChange: function (e) {
                _this.app.editor.config.setKey('autosave', e.target.checked);
                _this.app.call('sceneGraphChanged', _this);
            }
        }, {
            xtype: 'text',
            text: 'r' + THREE.REVISION,
            cls: 'title version'
        }]
    };

    var control = XType.create(data);
    control.parent = this.parent;
    control.render();
}

export default StatusMenu;