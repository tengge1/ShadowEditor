import UI from '../../ui/UI';

/**
 * Logo标志
 * @param {*} options 
 */
function Logo(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

Logo.prototype = Object.create(UI.Control.prototype);
Logo.prototype.constructor = Logo;

Logo.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'logo',
        html: '<i class="iconfont icon-shadow"></i>'
    });

    container.render();
}

export default Logo;