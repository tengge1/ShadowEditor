import { Control, UI } from '../third_party';

/**
 * Main
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Main(options = {}) {
    Control.call(this, options);
}

Main.prototype = Object.create(Control.prototype);
Main.prototype.constructor = Main;

Main.prototype.render = function () {
    this.renderDom(this.createElement('main'));
};

UI.addXType('main', Main);

export default Main;