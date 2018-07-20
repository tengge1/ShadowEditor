import UI from '../../ui/UI';

/**
 * Logo标志
 * @param {*} options 
 */
function Logo(options) {
    UI.Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

Logo.prototype = Object.create(UI.Control.prototype);
Logo.prototype.constructor = Logo;

Logo.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'logo',
        html: '<i class="iconfont icon-shadow"></i>'
    };

    var control = UI.create(data);
    control.render();
}

export default Logo;