import { Control, UI } from '../third_party';

/**
 * Video
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Video(options = {}) {
    Control.call(this, options);
}

Video.prototype = Object.create(Control.prototype);
Video.prototype.constructor = Video;

Video.prototype.render = function () {
    this.renderDom(this.createElement('video'));
};

UI.addXType('video', Video);

export default Video;