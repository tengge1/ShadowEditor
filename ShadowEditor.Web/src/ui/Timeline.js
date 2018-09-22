import Control from './Control';

/**
 * 时间轴
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 * @description 时间轴代码来自https://github.com/mrdoob/frame.js/blob/master/editor/js/Timeline.js
 */
function Timeline(options) {
    Control.call(this, options);
    options = options || {};

    this.duration = options.duration || 240;
    this.scale = options.scale || 32;

    this.cls = options.cls || 'TimeLine';
    this.style = options.style || null;
};

Timeline.prototype = Object.create(Control.prototype);
Timeline.prototype.constructor = Timeline;

Timeline.prototype.render = function () {
    this.dom = document.createElement('canvas');
    this.parent.appendChild(this.dom);

    this.dom.width = this.dom.clientWidth;
    this.dom.height = this.dom.clientHeight;

    this.dom.className = this.cls;

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    this.drawTimeline();
};

Timeline.prototype.drawTimeline = function () {
    var context = this.dom.getContext('2d');

    context.fillStyle = '#eee';
    context.fillRect(0, 0, this.dom.width, this.dom.height);

    context.strokeStyle = '#555';
    context.beginPath();

    var duration = this.duration;
    var scale = this.scale;
    var width = duration * scale;
    var scale4 = scale / 4;

    for (var i = 0.5; i <= width; i += scale) {
        context.moveTo(i + (scale4 * 0), 22);
        context.lineTo(i + (scale4 * 0), 30);

        if (scale > 16) context.moveTo(i + (scale4 * 1), 26), context.lineTo(i + (scale4 * 1), 30);
        if (scale > 8) context.moveTo(i + (scale4 * 2), 26), context.lineTo(i + (scale4 * 2), 30);
        if (scale > 16) context.moveTo(i + (scale4 * 3), 26), context.lineTo(i + (scale4 * 3), 30);
    }

    context.stroke();

    context.font = '12px Arial';
    context.fillStyle = '#888'
    context.textAlign = 'center';

    var step = Math.max(1, Math.floor(64 / scale));

    for (var i = 0; i < duration; i += step) {
        var minute = Math.floor(i / 60);
        var second = Math.floor(i % 60);

        var text = (minute > 0 ? minute + ':' : '') + ('0' + second).slice(-2);

        context.fillText(text, i * scale, 16);
    }
};

Timeline.prototype.updateUI = function () {
    if (this.dom === undefined) {
        this.render();
        return;
    }

    this.dom.width = this.dom.clientWidth;
    this.dom.height = this.dom.clientHeight;

    this.drawTimeline();
};

export default Timeline;