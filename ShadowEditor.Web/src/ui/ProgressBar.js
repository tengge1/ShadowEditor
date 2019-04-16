import Control from './Control';
import UI from './Manager';

/**
 * 进度条
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ProgressBar(options = {}) {
    Control.call(this, options);
}

ProgressBar.prototype = Object.create(Control.prototype);
ProgressBar.prototype.constructor = ProgressBar;

ProgressBar.prototype.render = function () {

};

UI.addXType('progressbar', ProgressBar);

export default ProgressBar;