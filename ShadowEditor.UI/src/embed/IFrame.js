import { Control, UI } from '../third_party';

/**
 * IFrame
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function IFrame(options = {}) {
    Control.call(this, options);
}

IFrame.prototype = Object.create(Control.prototype);
IFrame.prototype.constructor = IFrame;

IFrame.prototype.render = function () {
    this.renderDom(this.createElement('iframe'));
};

UI.addXType('iframe', IFrame);

export default IFrame;