import UI from '../../ui/UI';
import AnimationGroup from '../animation/AnimationGroup';
import Animation from '../animation/Animation';

const STOP = 0;
const PLAY = 1;
const PAUSE = 2;

/**
 * 动画面板
 * @author tengge / https://github.com/tengge1
 */
function AnimationPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;

    this.status = STOP;
    this.sliderLeft = 0;
    this.speed = 4;
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
                icon: 'icon-add',
                onClick: this.onAddGroup.bind(this)
            }, {
                xtype: 'iconbutton',
                icon: 'icon-delete',
                onClick: this.onRemoveGroup.bind(this)
            }, {
                xtype: 'div',
                style: {
                    width: '2px',
                    height: '20px',
                    borderLeft: '1px solid #aaa',
                    borderRight: '1px solid #aaa',
                    boxSizing: 'border-box',
                    margin: '5px 8px'
                }
            }, {
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
                id: 'speed',
                scope: this.id,
                style: {
                    marginLeft: '8px',
                    color: '#555',
                    fontSize: '12px'
                },
                text: 'X 1'
            }]
        }, {
            xtype: 'div',
            cls: 'box',
            children: [{
                xtype: 'timeline',
                id: 'timeline',
                cls: 'timeline',
                scope: this.id
            }, {
                xtype: 'div',
                cls: 'groups',
                id: 'groups',
                scope: this.id,
                children: []
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
    var timeline = UI.get('timeline', this.id);
    var groups = UI.get('groups', this.id);

    timeline.updateUI();

    groups.dom.addEventListener(`click`, this.onClick.bind(this));
    groups.dom.addEventListener(`dblclick`, this.onDblClick.bind(this));
    groups.dom.addEventListener(`mousedown`, this.onMouseDown.bind(this));
    groups.dom.addEventListener(`mousemove`, this.onMouseMove.bind(this));
    groups.dom.addEventListener(`mouseup`, this.onMouseUp.bind(this));

    this.app.on(`animationChanged.${this.id}`, this.onUpdateUI.bind(this));
};

AnimationPanel.prototype.onUpdateUI = function () {
    var animations = this.app.editor.animation.getAnimations();

    var groups = UI.get('groups', this.id);

    while (groups.dom.children.length) {
        var child = groups.dom.children[0];
        child.data = null;
        groups.dom.removeChild(child);
    }

    animations.forEach(n => {
        var group = document.createElement('div');
        group.className = 'group';
        group.data = n;
        groups.dom.appendChild(group);

        n.animations.forEach(m => {
            var item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = m.name;
            group.appendChild(item);
        });
    });
};

AnimationPanel.prototype.updateSlider = function () {
    var slider = UI.get('slider', this.id);
    var speed = UI.get('speed', this.id);

    slider.dom.style.left = this.sliderLeft + 'px';

    if (this.speed >= 4) {
        speed.dom.innerHTML = `X ${this.speed / 4}`;
    } else {
        speed.dom.innerHTML = `X 1/${4 / this.speed}`;
    }
};

AnimationPanel.prototype.onAnimate = function () {
    this.sliderLeft += this.speed / 4;
    this.updateSlider();
};

AnimationPanel.prototype.onAddGroup = function () {

};

AnimationPanel.prototype.onRemoveGroup = function () {

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
    this.updateSlider();
};

AnimationPanel.prototype.onForward = function () {
    if (this.speed >= 16) {
        return;
    }
    this.speed *= 2;
};

AnimationPanel.prototype.onBackward = function () {
    if (this.speed <= 1) {
        return;
    }
    this.speed /= 2;
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
    this.updateSlider();
};

AnimationPanel.prototype.onClick = function () {

};

AnimationPanel.prototype.onDblClick = function (event) {
    if (event.target.data && event.target.data.type === 'AnimationGroup') {
        event.stopPropagation();

        var animation = new Animation();
        event.target.data.add(animation);

        this.app.call('animationChanged', this);
    }
};

AnimationPanel.prototype.onMouseDown = function () {

};

AnimationPanel.prototype.onMouseMove = function () {

};

AnimationPanel.prototype.onMouseUp = function () {

};

export default AnimationPanel;