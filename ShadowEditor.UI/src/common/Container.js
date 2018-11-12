import { Control, UI } from '../third_party';

/**
 * 容器
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Container(options = {}) {
    Control.call(this, options);
}

Container.prototype = Object.create(Control.prototype);
Container.prototype.constructor = Container;

UI.addXType('container', Container);

export default Container;