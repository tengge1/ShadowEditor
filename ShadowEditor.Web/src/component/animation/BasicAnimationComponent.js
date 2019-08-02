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
                text: L_BASIC_INFORMATION
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_NAME
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
                text: L_TARGET
            }, {
                xtype: 'input',
                id: 'target',
                scope: this.id,
                disabled: true,
                style: {
                    width: '80px',
                    marginRight: '8px'
                }
            }, {
                xtype: 'button',
                id: 'btnSetTarget',
                scope: this.id,
                text: L_SET,
                onClick: this.onSetTarget.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_TYPE
            }, {
                xtype: 'select',
                id: 'type',
                scope: this.id,
                options: {
                    Tween: L_TWEEN_ANIMATION,
                    Skeletal: L_SKELETAL_ANIMATION,
                    Audio: L_PLAY_AUDIO,
                    Filter: L_FILTER_ANIMATION,
                    Particle: L_PARTICLE_ANIMATION
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_BEGIN_TIME
            }, {
                xtype: 'number',
                id: 'beginTime',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_END_TIME
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

    app.on(`animationSelected.${this.id}`, this.onAnimationSelected.bind(this));
    app.on(`animationChanged.${this.id}`, this.onAnimationChanged.bind(this));
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
    var target = UI.get('target', this.id);
    var type = UI.get('type', this.id);
    var beginTime = UI.get('beginTime', this.id);
    var endTime = UI.get('endTime', this.id);

    name.setValue(this.animation.name);

    if (!this.animation.target) {
        target.setValue('(' + L_NONE + ')');
    } else {
        var obj = app.editor.objectByUuid(this.animation.target);
        if (obj === null) {
            target.setValue('(' + L_NONE + ')');
            console.warn(`BasicAnimationComponent: ${L_ANIMATION_OBJECT} ${this.animation.target} ${L_NOT_EXISTED_IN_SCENE}`);
        } else {
            target.setValue(obj.name);
        }
    }

    type.setValue(this.animation.type);
    beginTime.setValue(this.animation.beginTime);
    endTime.setValue(this.animation.endTime);
};

BasicAnimationComponent.prototype.onSetTarget = function () {
    var selected = app.editor.selected;
    if (selected == null) {
        this.animation.target = null;
    } else {
        this.animation.target = selected.uuid;
    }

    app.call('animationChanged', this, this.animation);
};

BasicAnimationComponent.prototype.onChange = function () {
    var name = UI.get('name', this.id);
    var type = UI.get('type', this.id);
    var beginTime = UI.get('beginTime', this.id);
    var endTime = UI.get('endTime', this.id);

    this.animation.name = name.getValue();
    this.animation.type = type.getValue();
    this.animation.beginTime = beginTime.getValue();
    this.animation.endTime = endTime.getValue();

    app.call('animationChanged', this, this.animation);
};

export default BasicAnimationComponent;