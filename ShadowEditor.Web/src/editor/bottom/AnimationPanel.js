import UI from '../../ui/UI';

const STOP = 0;
const PLAY = 1;
const PAUSE = 2;

/**
 * 动画面板
 * @author tengge / https://github.com/tengge1
 * @description 时间轴代码来自https://github.com/mrdoob/frame.js/blob/master/editor/js/Timeline.js
 */
function AnimationPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;

    this.canvas = null;
    this.context = null;

    this.status = STOP;
    this.sliderLeft = 0;
};

AnimationPanel.prototype = Object.create(UI.Control.prototype);
AnimationPanel.prototype.constructor = AnimationPanel;

AnimationPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'animation-panel',
        children: [{
            xtype: 'div',
            cls: 'controls',
            children: [{
                xtype: 'iconbutton',
                icon: 'icon-backward',
                onClick: this.onBackward.bind(this)
            }, {
                xtype: 'iconbutton',
                id: 'btnPlay',
                scope: this.id,
                icon: 'icon-play',
                onClick: this.onPlay.bind(this)
            }, {
                xtype: 'iconbutton',
                id: 'btnPause',
                scope: this.id,
                icon: 'icon-pause',
                style: {
                    display: 'none'
                },
                onClick: this.onPause.bind(this)
            }, {
                xtype: 'iconbutton',
                icon: 'icon-forward',
                onClick: this.onForward.bind(this)
            }, {
                xtype: 'iconbutton',
                icon: 'icon-stop',
                onClick: this.onStop.bind(this)
            }, {
                xtype: 'text',
                text: 'X1'
            }]
        }, {
            xtype: 'div',
            cls: 'box',
            children: [{
                xtype: 'canvas',
                cls: 'timeline',
                id: 'timeline',
                scope: this.id
            }, {
                xtype: 'div',
                cls: 'slider',
                id: 'slider',
                scope: this.id
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`appStarted.${this.id}`, this.onAppStarted.bind(this));
};

AnimationPanel.prototype.onAppStarted = function () {
    var canvas = UI.get('timeline', this.id).dom;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    var context = canvas.getContext('2d', {
        alpha: false
    });

    this.canvas = canvas;
    this.context = context;

    context.fillStyle = '#eee';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = '#555';
    context.beginPath();

    var duration = 240;
    var scale = 32;
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

AnimationPanel.prototype.updateUI = function () {
    var slider = UI.get('slider', this.id);
    slider.dom.style.left = this.sliderLeft + 'px';
};

AnimationPanel.prototype.onAnimate = function () {
    this.sliderLeft++;
    this.updateUI();
};

AnimationPanel.prototype.onBackward = function () {

};

AnimationPanel.prototype.onPlay = function () {
    if (this.status === PLAY) {
        return;
    }
    this.status = PLAY;

    UI.get('btnPlay', this.id).dom.style.display = 'none';
    UI.get('btnPause', this.id).dom.style.display = '';

    this.app.on(`animate.${this.id}`, this.onAnimate.bind(this));
};

AnimationPanel.prototype.onPause = function () {
    if (this.status === PAUSE) {
        return;
    }
    this.status = PAUSE;

    UI.get('btnPlay', this.id).dom.style.display = '';
    UI.get('btnPause', this.id).dom.style.display = 'none';

    this.app.on(`animate.${this.id}`, null);
    this.updateUI();
};

AnimationPanel.prototype.onForward = function () {

};

AnimationPanel.prototype.onStop = function () {
    if (this.status === STOP) {
        return;
    }
    this.status = STOP;

    UI.get('btnPlay', this.id).dom.style.display = '';
    UI.get('btnPause', this.id).dom.style.display = 'none';

    this.app.on(`animate.${this.id}`, null);
    this.sliderLeft = 0;
    this.updateUI();
};

export default AnimationPanel;