import { Control, UI } from './third_party';

/**
 * SVG线
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Group(options = {}) {
    Control.call(this, options);
}

Group.prototype = Object.create(Control.prototype);
Group.prototype.constructor = Group;

Group.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.renderDom(dom);
};

UI.addXType('svggroup', Group);

export default Group;