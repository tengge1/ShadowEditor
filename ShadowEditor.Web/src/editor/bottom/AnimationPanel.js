import UI from '../../ui/UI';

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
                icon: 'icon-backward'
            }, {
                xtype: 'iconbutton',
                icon: 'icon-play'
            }, {
                xtype: 'iconbutton',
                icon: 'icon-forward'
            }, {
                xtype: 'iconbutton',
                icon: 'icon-stop'
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
                id: 'timeline'
            }, {
                xtype: 'div',
                cls: 'slider',
                id: 'slider'
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`appStarted.${this.id}`, this.onAppStarted.bind(this));
};

AnimationPanel.prototype.onAppStarted = function () {
    var canvas = UI.get('timeline').dom;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    var context = canvas.getContext('2d', { alpha: false });

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
        context.moveTo(i + (scale4 * 0), 22); context.lineTo(i + (scale4 * 0), 30);

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

        var text = (minute > 0 ? minute + ':' : '') + ('0' + second).slice(- 2);

        context.fillText(text, i * scale, 16);
    }
};

export default AnimationPanel;