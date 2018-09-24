import UI from '../../ui/UI';
import AnimationGroup from '../../animation/AnimationGroup';
import Animation from '../../animation/Animation';

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

    this.isDragging = false;
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
                id: 'time',
                scope: this.id,
                style: {
                    marginLeft: '8px',
                    color: '#555',
                    fontSize: '12px'
                },
                text: '00:00'
            }, {
                xtype: 'text',
                id: 'speed',
                scope: this.id,
                style: {
                    marginLeft: '8px',
                    color: '#aaa',
                    fontSize: '12px'
                },
                text: 'X 1'
            }, {
                xtype: 'toolbarfiller'
            }, {
                xtype: 'text',
                scope: this.id,
                style: {
                    marginLeft: '8px',
                    color: '#aaa',
                    fontSize: '12px'
                },
                text: '说明：双击时间轴下方添加动画。'
            }]
        }, {
            xtype: 'div',
            cls: 'box',
            children: [{
                xtype: 'div',
                cls: 'left-area',
                id: 'groupInfo',
                scope: this.id
            }, {
                xtype: 'div',
                cls: 'right-area',
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
    groups.dom.style.width = timeline.dom.clientWidth + 'px';

    groups.dom.addEventListener(`click`, this.onClick.bind(this));
    groups.dom.addEventListener(`dblclick`, this.onDblClick.bind(this));
    groups.dom.addEventListener(`mousedown`, this.onMouseDown.bind(this));
    groups.dom.addEventListener(`mousemove`, this.onMouseMove.bind(this));
    document.body.addEventListener(`mouseup`, this.onMouseUp.bind(this));

    this.app.on(`animationChanged.${this.id}`, this.updateUI.bind(this));
};

AnimationPanel.prototype.updateUI = function () {
    var animations = this.app.editor.animation.getAnimationGroups();

    var groupInfo = UI.get('groupInfo', this.id);
    var timeline = UI.get('timeline', this.id);
    var groups = UI.get('groups', this.id);

    while (groupInfo.dom.children.length) {
        var child = groupInfo.dom.children[0];
        groupInfo.dom.removeChild(child);
    }

    while (groups.dom.children.length) {
        var child = groups.dom.children[0];
        child.data = null;
        groups.dom.removeChild(child);
    }

    animations.forEach(n => {
        // 动画组信息区
        var groupName = document.createElement('div');
        groupName.className = 'group-info';
        groupName.innerHTML = `<input type="checkbox" data-uuid="${n.uuid}" />${n.name}`;
        groupInfo.dom.appendChild(groupName);

        // 动画区
        var group = document.createElement('div');
        group.className = 'group';
        group.setAttribute('droppable', true);
        group.data = n;
        group.addEventListener('dragenter', this.onDragEnterGroup.bind(this));
        group.addEventListener('dragover', this.onDragOverGroup.bind(this));
        group.addEventListener('dragleave', this.onDragLeaveGroup.bind(this));
        group.addEventListener('drop', this.onDropGroup.bind(this));
        groups.dom.appendChild(group);

        n.animations.forEach(m => {
            var item = document.createElement('div');
            item.data = m;
            item.className = 'item';
            item.setAttribute('draggable', true);
            item.setAttribute('droppable', false);
            item.style.left = m.startTime * timeline.scale + 'px';
            item.style.width = (m.endTime - m.startTime) * timeline.scale + 'px';
            item.innerHTML = m.name;
            item.addEventListener('dragstart', this.onDragStartAnimation.bind(this));
            item.addEventListener('dragend', this.onDragEndAnimation.bind(this));
            group.appendChild(item);
        });
    });
};

AnimationPanel.prototype.updateSlider = function () {
    var timeline = UI.get('timeline', this.id);
    var slider = UI.get('slider', this.id);
    var time = UI.get('time', this.id);
    var speed = UI.get('speed', this.id);

    slider.dom.style.left = this.sliderLeft + 'px';

    var minute = ('0' + Math.floor(this.sliderLeft / timeline.scale / 60)).slice(-2);
    var second = ('0' + Math.floor(this.sliderLeft / timeline.scale % 60)).slice(-2);

    time.setValue(`${minute}:${second}`);

    if (this.speed >= 4) {
        speed.dom.innerHTML = `X ${this.speed / 4}`;
    } else {
        speed.dom.innerHTML = `X 1/${4 / this.speed}`;
    }
};

AnimationPanel.prototype.onAnimate = function () {
    var timeline = UI.get('timeline', this.id);
    this.sliderLeft += this.speed / 4;

    if (this.sliderLeft >= timeline.dom.clientWidth) {
        this.sliderLeft = 0;
    }

    this.updateSlider();
};

AnimationPanel.prototype.onAddGroup = function () {
    var group = new AnimationGroup();
    this.app.editor.animation.add(group);
    this.updateUI();
};

AnimationPanel.prototype.onRemoveGroup = function () {
    var inputs = document.querySelectorAll('.animation-panel .left-area input:checked');

    var uuids = [];
    inputs.forEach(n => {
        uuids.push(n.getAttribute('data-uuid'));
    });

    if (uuids.length === 0) {
        UI.msg('请勾选需要删除的组！');
        return;
    }

    UI.confirm('询问', '删除组会删除组上的所有动画。是否删除？', (event, btn) => {
        if (btn === 'ok') {
            uuids.forEach(n => {
                this.app.editor.animation.removeByUUID(n);
            });
            this.updateUI();
        }
    });
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

AnimationPanel.prototype.onClick = function (event) {
    if (event.target.data.type === 'AnimationGroup') {
        return;
    }
    this.app.call('tabSelected', this, 'animation');
    this.app.call('animationSelected', this, event.target.data);
};

AnimationPanel.prototype.onDblClick = function (event) {
    var timeline = UI.get('timeline', this.id);

    if (event.target.data && event.target.data.type === 'AnimationGroup') {
        event.stopPropagation();

        var animation = new Animation({
            startTime: event.offsetX / timeline.scale,
            endTime: (event.offsetX + 80) / timeline.scale
        });

        event.target.data.add(animation);

        this.app.call('animationChanged', this);
    }
};

AnimationPanel.prototype.onMouseDown = function () {
    if (this.isDragging) {
        return;
    }
    this.isDragging = true;
};

AnimationPanel.prototype.onMouseMove = function () {

};

AnimationPanel.prototype.onMouseUp = function () {
    this.isDragging = false;
};

// ----------------------- 拖动动画事件 ---------------------------------------------

AnimationPanel.prototype.onDragStartAnimation = function (event) {
    event.dataTransfer.setData('uuid', event.target.data.uuid);
    event.dataTransfer.setData('offsetX', event.offsetX);
};

AnimationPanel.prototype.onDragEndAnimation = function (event) {
    event.dataTransfer.clearData();
};

AnimationPanel.prototype.onDragEnterGroup = function (event) {
    event.preventDefault();
};

AnimationPanel.prototype.onDragOverGroup = function (event) {
    event.preventDefault();
};

AnimationPanel.prototype.onDragLeaveGroup = function (event) {
    event.preventDefault();
};

AnimationPanel.prototype.onDropGroup = function (event) {
    event.preventDefault();
    var uuid = event.dataTransfer.getData('uuid');
    var offsetX = event.dataTransfer.getData('offsetX');

    var groups = this.app.editor.animation.getAnimationGroups();
    var group = groups.filter(n => n.animations.findIndex(m => m.uuid === uuid) > -1)[0];
    var animation = group.animations.filter(n => n.uuid === uuid)[0];
    group.remove(animation);

    var timeline = UI.get('timeline', this.id);
    var length = animation.endTime - animation.startTime;
    animation.startTime = (event.offsetX - offsetX) / timeline.scale;
    animation.endTime = animation.startTime + length;

    if (event.target.data instanceof Animation) { // 拖动到其他动画上
        event.target.parentElement.data.add(animation);
    } else { // 拖动到动画组上
        event.target.data.add(animation);
    }

    this.updateUI();
};

export default AnimationPanel;