import BaseComponent from '../BaseComponent';

/**
 * 动画基本信息组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function BasicAnimationComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

BasicAnimationComponent.prototype = Object.create(BaseComponent.prototype);
BasicAnimationComponent.prototype.constructor = BasicAnimationComponent;

BasicAnimationComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'basicAnimationPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: 0,
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    width: '100%',
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '动画基本信息'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '名称'
            }, {
                xtype: 'input',
                id: 'name',
                scope: this.id,
                style: {
                    width: '120px'
                },
                onInput: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '类型'
            }, {
                xtype: 'select',
                id: 'type',
                scope: this.id,
                options: {
                    Tween: '补间动画',
                    Skeletal: '骨骼动画',
                    Audio: '播放音乐',
                    Filter: '滤镜动画',
                    Particle: '粒子动画'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '开始时间'
            }, {
                xtype: 'number',
                id: 'startTime',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '结束时间'
            }, {
                xtype: 'number',
                id: 'endTime',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`animationSelected.${this.id}`, this.onAnimationSelected.bind(this));
    this.app.on(`animationChanged.${this.id}`, this.onAnimationChanged.bind(this));
};

BasicAnimationComponent.prototype.onAnimationSelected = function (animation) {
    this.updateUI(animation);
};

BasicAnimationComponent.prototype.onAnimationChanged = function (animation) {
    this.updateUI(animation);
};

BasicAnimationComponent.prototype.updateUI = function (animation) {
    var container = UI.get('basicAnimationPanel', this.id);
    if (animation) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.animation = animation;

    var name = UI.get('name', this.id);
    var type = UI.get('type', this.id);
    var startTime = UI.get('startTime', this.id);
    var endTime = UI.get('endTime', this.id);

    name.setValue(this.animation.name);
    type.setValue(this.animation.type);
    startTime.setValue(this.animation.startTime);
    endTime.setValue(this.animation.endTime);
};

BasicAnimationComponent.prototype.onChange = function () {
    var name = UI.get('name', this.id);
    var type = UI.get('type', this.id);
    var startTime = UI.get('startTime', this.id);
    var endTime = UI.get('endTime', this.id);

    this.animation.name = name.getValue();
    this.animation.type = type.getValue();
    this.animation.startTime = startTime.getValue();
    this.animation.endTime = endTime.getValue();

    this.app.call('animationChanged', this, this.animation);
};

export default BasicAnimationComponent;