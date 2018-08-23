import UI from '../../ui/UI';

/**
 * 状态菜单（菜单栏右侧）
 * @author tengge / https://github.com/tengge1
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

    var container = UI.create({
        xtype: 'div',
        id: 'mStatus',
        parent: this.parent,
        cls: 'menu right',
        children: [{
            xtype: 'text',
            text: 'r' + THREE.REVISION,
            cls: 'title version'
        }]
    });

    container.render();
}

export default StatusMenu;