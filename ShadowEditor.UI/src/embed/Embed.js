import { Control, UI } from '../third_party';

/**
 * Embed
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Embed(options = {}) {
    Control.call(this, options);
}

Embed.prototype = Object.create(Control.prototype);
Embed.prototype.constructor = Embed;

Embed.prototype.render = function () {
    this.renderDom(this.createElement('embed'));
};

UI.addXType('embed', Embed);

export default Embed;