import UI from '../../ui/UI';

/**
 * 状态菜单（菜单栏右侧）
 * @param {*} options 
 */
function StatusMenu(options) {
    UI.Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

StatusMenu.prototype = Object.create(UI.Control.prototype);
StatusMenu.prototype.constructor = StatusMenu;

StatusMenu.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        id: 'mStatus',
        parent: this.parent,
        cls: 'menu right',
        children: [{
            id: 'bAutoSave',
            xtype: 'boolean',
            text: '自动保存',
            value: true,
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

    var control = UI.create(data);
    control.render();
}

export default StatusMenu;