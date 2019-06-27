import UI from '../../ui/UI';

/**
 * Logo标志
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Logo(options) {
    UI.Control.call(this, options);
    app = options.app;
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