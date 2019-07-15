import Control from './Control';
import UI from './Manager';

/**
 * 进度条
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ProgressBar(options = {}) {
    Control.call(this, options);

    this.max = options.max || 100;
    this.current = options.current || 0;

    this.cls = options.cls || 'ProgressBar';
    this.style = options.style || null;
}

ProgressBar.prototype = Object.create(Control.prototype);
ProgressBar.prototype.constructor = ProgressBar;

ProgressBar.prototype.render = function () {
    this.dom = document.createElement('div');
    this.parent.appendChild(this.dom);

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    this.bar = document.createElement('div');
    this.dom.appendChild(this.bar);

    this.bar.className = 'Bar';
};

ProgressBar.prototype.getCurrent = function () {
    return this.current;
};

ProgressBar.prototype.setCurrent = function (value) {
    this.current = value;

    this.bar.style.width = (this.current / this.max * 100) + '%';
};

UI.addXType('progressbar', ProgressBar);

export default ProgressBar;