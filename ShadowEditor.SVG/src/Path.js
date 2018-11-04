import { Control, UI } from './third_party';

/**
 * SVG线
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Path(options = {}) {
    Control.call(this, options);
}

Path.prototype = Object.create(Control.prototype);
Path.prototype.constructor = Path;

Path.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.renderDom(dom);
};

UI.addXType('svgpath', Path);

export default Path;