import { Control, UI } from '../third_party';

/**
 * Legend
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Legend(options = {}) {
    Control.call(this, options);
}

Legend.prototype = Object.create(Control.prototype);
Legend.prototype.constructor = Legend;

Legend.prototype.render = function () {
    this.renderDom(this.createElement('legend'));
};

UI.addXType('legend', Legend);

export default Legend;