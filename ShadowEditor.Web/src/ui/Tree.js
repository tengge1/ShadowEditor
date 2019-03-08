import Control from './Control';
import UI from './Manager';

/**
 * 树状控件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Tree(options = {}) {
    Control.call(this, options);
};

Tree.prototype = Object.create(Control.prototype);
Tree.prototype.constructor = Tree;

Tree.prototype.render = function () {

};

UI.addXType('tree', Tree);

export default Tree;