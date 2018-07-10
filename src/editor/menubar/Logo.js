import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * Logo标志
 * @param {*} options 
 */
function Logo(options) {
    Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

Logo.prototype = Object.create(Control.prototype);
Logo.prototype.constructor = Logo;

Logo.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        cls: 'logo',
        html: '<i class="iconfont icon-shadow"></i>'
    };

    var control = XType.create(data);
    control.parent = this.parent;
    control.render();
}

export default Logo;