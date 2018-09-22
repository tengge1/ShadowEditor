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

    this.duration = options.duration || 120; // 持续时长(秒)
    this.scale = options.scale || 30; // 尺寸，1秒=30像素

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
    var duration = this.duration; // 持续秒数
    var scale = this.scale; // 1秒像素数
    var width = duration * scale; // 画布宽度
    var scale5 = scale / 5; // 0.2秒像素数
    var margin = 0; // 时间轴前后间距

    this.dom.style.width = (width + margin * 2) + 'px';
    this.dom.width = this.dom.clientWidth;

    var context = this.dom.getContext('2d');

    // 时间轴背景
    context.fillStyle = '#eee';
    context.fillRect(0, 0, this.dom.width, this.dom.height);

    // 时间轴刻度
    context.strokeStyle = '#555';
    context.beginPath();

    for (var i = margin; i <= width + margin; i += scale) { // 绘制每一秒
        for (var j = 0; j < 5; j++) { // 绘制每个小格
            if (j === 0) { // 长刻度
                context.moveTo(i + scale5 * j, 22);
                context.lineTo(i + scale5 * j, 30);
            } else { // 短刻度
                context.moveTo(i + scale5 * j, 26);
                context.lineTo(i + scale5 * j, 30);
            }
        }
    }

    context.stroke();

    // 时间轴文字
    context.font = '12px Arial';
    context.fillStyle = '#888'

    for (var i = 0; i <= duration; i += 2) { // 对于每两秒
        var minute = Math.floor(i / 60);
        var second = Math.floor(i % 60);

        var text = (minute > 0 ? minute + ':' : '') + ('0' + second).slice(-2);

        if (i === 0) {
            context.textAlign = 'left';
        } else if (i === duration) {
            context.textAlign = 'right';
        } else {
            context.textAlign = 'center';
        }

        context.fillText(text, margin + i * scale, 16);
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