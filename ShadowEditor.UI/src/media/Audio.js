import { Control, UI } from '../third_party';

/**
 * Audio
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Audio(options = {}) {
    Control.call(this, options);
}

Audio.prototype = Object.create(Control.prototype);
Audio.prototype.constructor = Audio;

Audio.prototype.render = function () {
    this.renderDom(this.createElement('audio'));
};

UI.addXType('audio', Audio);

export default Audio;