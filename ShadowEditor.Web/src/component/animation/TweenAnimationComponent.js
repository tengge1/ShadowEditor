import BaseComponent from '../BaseComponent';

/**
 * 补间动画组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TweenAnimationComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

TweenAnimationComponent.prototype = Object.create(BaseComponent.prototype);
TweenAnimationComponent.prototype.constructor = TweenAnimationComponent;

TweenAnimationComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'tweenAnimationPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
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
                text: L_TWEEN_ANIMATION
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_BEGIN_STATUS
            }, {
                xtype: 'select',
                id: 'beginStatus',
                scope: this.id,
                options: {
                    Current: L_CURRENT_STATUS,
                    Custom: L_CUSTOM_STATUS
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'beginPositionRow',
            scope: this.id,
            style: {
                display: 'none'
            },
            children: [{
                xtype: 'label',
                text: L_TRANSLATE
            }, {
                xtype: 'number',
                id: 'beginPositionX',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'beginPositionY',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'beginPositionZ',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'beginRotationRow',
            scope: this.id,
            style: {
                display: 'none'
            },
            children: [{
                xtype: 'label',
                text: L_ROTATE
            }, {
                xtype: 'number',
                id: 'beginRotationX',
                scope: this.id,
                step: 10,
                unit: '°',
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'beginRotationY',
                scope: this.id,
                step: 10,
                unit: '°',
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'beginRotationZ',
                scope: this.id,
                step: 10,
                unit: '°',
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'beginScaleRow',
            scope: this.id,
            style: {
                display: 'none'
            },
            children: [{
                xtype: 'label',
                text: L_SCALE
            }, {
                xtype: 'checkbox',
                id: 'beginScaleLock',
                scope: this.id,
                value: true,
                style: {
                    position: 'absolute',
                    left: '50px'
                }
            }, {
                xtype: 'number',
                id: 'beginScaleX',
                scope: this.id,
                value: 1,
                range: [0.01, Infinity],
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'beginScaleY',
                scope: this.id,
                value: 1,
                range: [0.01, Infinity],
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'beginScaleZ',
                scope: this.id,
                value: 1,
                range: [0.01, Infinity],
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_EASE_FUNC
            }, {
                xtype: 'select',
                id: 'ease',
                scope: this.id,
                options: {
                    linear: 'Linear',
                    quadIn: 'Quad In',
                    quadOut: 'Quad Out',
                    quadInOut: 'Quad In Out',
                    cubicIn: 'Cubic In',
                    cubicOut: 'Cubic Out',
                    cubicInOut: 'Cubic InOut',
                    quartIn: 'Quart In',
                    quartOut: 'Quart Out',
                    quartInOut: 'Quart InOut',
                    quintIn: 'Quint In',
                    quintOut: 'Quint Out',
                    quintInOut: 'Quint In Out',
                    sineIn: 'Sine In',
                    sineOut: 'Sine Out',
                    sineInOut: 'Sine In Out',
                    backIn: 'Back In',
                    backOut: 'Back Out',
                    backInOut: 'Back In Out',
                    circIn: 'Circ In',
                    circOut: 'Circ Out',
                    circInOut: 'Circ In Out',
                    bounceIn: 'Bounce In',
                    bounceOut: 'Bounce Out',
                    bounceInOut: 'Bounce In Out',
                    elasticIn: 'Elastic In',
                    elasticOut: 'Elastic Out',
                    elasticInOut: 'Elastic In Out'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_END_STATUS
            }, {
                xtype: 'select',
                id: 'endStatus',
                scope: this.id,
                options: {
                    Current: L_CURRENT_STATUS,
                    Custom: L_CUSTOM_STATUS
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'endPositionRow',
            scope: this.id,
            style: {
                display: 'none'
            },
            children: [{
                xtype: 'label',
                text: L_TRANSLATE
            }, {
                xtype: 'number',
                id: 'endPositionX',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'endPositionY',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'endPositionZ',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'endRotationRow',
            scope: this.id,
            style: {
                display: 'none'
            },
            children: [{
                xtype: 'label',
                text: L_ROTATE
            }, {
                xtype: 'number',
                id: 'endRotationX',
                scope: this.id,
                step: 10,
                unit: '°',
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'endRotationY',
                scope: this.id,
                step: 10,
                unit: '°',
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'endRotationZ',
                scope: this.id,
                step: 10,
                unit: '°',
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'endScaleRow',
            scope: this.id,
            style: {
                display: 'none'
            },
            children: [{
                xtype: 'label',
                text: L_SCALE
            }, {
                xtype: 'checkbox',
                id: 'endScaleLock',
                scope: this.id,
                value: true,
                style: {
                    position: 'absolute',
                    left: '50px'
                }
            }, {
                xtype: 'number',
                id: 'endScaleX',
                scope: this.id,
                value: 1,
                range: [0.01, Infinity],
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'endScaleY',
                scope: this.id,
                value: 1,
                range: [0.01, Infinity],
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'endScaleZ',
                scope: this.id,
                value: 1,
                range: [0.01, Infinity],
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on(`animationSelected.${this.id}`, this.onAnimationSelected.bind(this));
    app.on(`animationChanged.${this.id}`, this.onAnimationChanged.bind(this));
};

TweenAnimationComponent.prototype.onAnimationSelected = function (animation) {
    this.updateUI(animation);
};

TweenAnimationComponent.prototype.onAnimationChanged = function (animation) {
    this.updateUI(animation);
};

TweenAnimationComponent.prototype.updateUI = function (animation) {
    var container = UI.get('tweenAnimationPanel', this.id);
    if (animation && animation.type === 'Tween') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.animation = animation;

    var beginPositionRow = UI.get('beginPositionRow', this.id);
    var beginRotationRow = UI.get('beginRotationRow', this.id);
    var beginScaleRow = UI.get('beginScaleRow', this.id);
    var endPositionRow = UI.get('endPositionRow', this.id);
    var endRotationRow = UI.get('endRotationRow', this.id);
    var endScaleRow = UI.get('endScaleRow', this.id);

    var beginStatus = UI.get('beginStatus', this.id);
    var beginPositionX = UI.get('beginPositionX', this.id);
    var beginPositionY = UI.get('beginPositionY', this.id);
    var beginPositionZ = UI.get('beginPositionZ', this.id);
    var beginRotationX = UI.get('beginRotationX', this.id);
    var beginRotationY = UI.get('beginRotationY', this.id);
    var beginRotationZ = UI.get('beginRotationZ', this.id);
    var beginScaleLock = UI.get('beginScaleLock', this.id);
    var beginScaleX = UI.get('beginScaleX', this.id);
    var beginScaleY = UI.get('beginScaleY', this.id);
    var beginScaleZ = UI.get('beginScaleZ', this.id);
    var ease = UI.get('ease', this.id);
    var endStatus = UI.get('endStatus', this.id);
    var endPositionX = UI.get('endPositionX', this.id);
    var endPositionY = UI.get('endPositionY', this.id);
    var endPositionZ = UI.get('endPositionZ', this.id);
    var endRotationX = UI.get('endRotationX', this.id);
    var endRotationY = UI.get('endRotationY', this.id);
    var endRotationZ = UI.get('endRotationZ', this.id);
    var endScaleLock = UI.get('endScaleLock', this.id);
    var endScaleX = UI.get('endScaleX', this.id);
    var endScaleY = UI.get('endScaleY', this.id);
    var endScaleZ = UI.get('endScaleZ', this.id);

    var data = this.animation.data;

    switch (data.beginStatus) {
        case 'Current':
            beginPositionRow.dom.style.display = 'none';
            beginRotationRow.dom.style.display = 'none';
            beginScaleRow.dom.style.display = 'none';
            break;
        case 'Custom':
            beginPositionRow.dom.style.display = '';
            beginRotationRow.dom.style.display = '';
            beginScaleRow.dom.style.display = '';
            break;
    }

    switch (data.endStatus) {
        case 'Current':
            endPositionRow.dom.style.display = 'none';
            endRotationRow.dom.style.display = 'none';
            endScaleRow.dom.style.display = 'none';
            break;
        case 'Custom':
            endPositionRow.dom.style.display = '';
            endRotationRow.dom.style.display = '';
            endScaleRow.dom.style.display = '';
            break;
    }

    beginStatus.setValue(data.beginStatus);
    beginPositionX.setValue(data.beginPositionX);
    beginPositionY.setValue(data.beginPositionY);
    beginPositionZ.setValue(data.beginPositionZ);
    beginRotationX.setValue(data.beginRotationX * 180 / Math.PI);
    beginRotationY.setValue(data.beginRotationY * 180 / Math.PI);
    beginRotationZ.setValue(data.beginRotationZ * 180 / Math.PI);
    beginScaleLock.setValue(data.beginScaleLock);
    beginScaleX.setValue(data.beginScaleX);
    beginScaleY.setValue(data.beginScaleY);
    beginScaleZ.setValue(data.beginScaleZ);
    ease.setValue(data.ease);
    endStatus.setValue(data.endStatus);
    endPositionX.setValue(data.endPositionX);
    endPositionY.setValue(data.endPositionY);
    endPositionZ.setValue(data.endPositionZ);
    endRotationX.setValue(data.endRotationX * 180 / Math.PI);
    endRotationY.setValue(data.endRotationY * 180 / Math.PI);
    endRotationZ.setValue(data.endRotationZ * 180 / Math.PI);
    endScaleLock.setValue(data.endScaleLock);
    endScaleX.setValue(data.endScaleX);
    endScaleY.setValue(data.endScaleY);
    endScaleZ.setValue(data.endScaleZ);
};

TweenAnimationComponent.prototype.onChange = function () {
    var beginPositionRow = UI.get('beginPositionRow', this.id);
    var beginRotationRow = UI.get('beginRotationRow', this.id);
    var beginScaleRow = UI.get('beginScaleRow', this.id);
    var endPositionRow = UI.get('endPositionRow', this.id);
    var endRotationRow = UI.get('endRotationRow', this.id);
    var endScaleRow = UI.get('endScaleRow', this.id);

    var beginStatus = UI.get('beginStatus', this.id);
    var beginPositionX = UI.get('beginPositionX', this.id);
    var beginPositionY = UI.get('beginPositionY', this.id);
    var beginPositionZ = UI.get('beginPositionZ', this.id);
    var beginRotationX = UI.get('beginRotationX', this.id);
    var beginRotationY = UI.get('beginRotationY', this.id);
    var beginRotationZ = UI.get('beginRotationZ', this.id);
    var beginScaleLock = UI.get('beginScaleLock', this.id);
    var beginScaleX = UI.get('beginScaleX', this.id);
    var beginScaleY = UI.get('beginScaleY', this.id);
    var beginScaleZ = UI.get('beginScaleZ', this.id);
    var ease = UI.get('ease', this.id);
    var endStatus = UI.get('endStatus', this.id);
    var endPositionX = UI.get('endPositionX', this.id);
    var endPositionY = UI.get('endPositionY', this.id);
    var endPositionZ = UI.get('endPositionZ', this.id);
    var endRotationX = UI.get('endRotationX', this.id);
    var endRotationY = UI.get('endRotationY', this.id);
    var endRotationZ = UI.get('endRotationZ', this.id);
    var endScaleLock = UI.get('endScaleLock', this.id);
    var endScaleX = UI.get('endScaleX', this.id);
    var endScaleY = UI.get('endScaleY', this.id);
    var endScaleZ = UI.get('endScaleZ', this.id);

    switch (beginStatus.getValue()) {
        case 'Current':
            beginPositionRow.dom.style.display = 'none';
            beginRotationRow.dom.style.display = 'none';
            beginScaleRow.dom.style.display = 'none';
            break;
        case 'Custom':
            beginPositionRow.dom.style.display = '';
            beginRotationRow.dom.style.display = '';
            beginScaleRow.dom.style.display = '';
            break;
    }

    switch (endStatus.getValue()) {
        case 'Current':
            endPositionRow.dom.style.display = 'none';
            endRotationRow.dom.style.display = 'none';
            endScaleRow.dom.style.display = 'none';
            break;
        case 'Custom':
            endPositionRow.dom.style.display = '';
            endRotationRow.dom.style.display = '';
            endScaleRow.dom.style.display = '';
            break;
    }

    this.animation.data = this.animation.data || {};

    this.animation.data.beginStatus = beginStatus.getValue();
    this.animation.data.beginPositionX = beginPositionX.getValue();
    this.animation.data.beginPositionY = beginPositionY.getValue();
    this.animation.data.beginPositionZ = beginPositionZ.getValue();
    this.animation.data.beginRotationX = beginRotationX.getValue() * Math.PI / 180;
    this.animation.data.beginRotationY = beginRotationY.getValue() * Math.PI / 180;
    this.animation.data.beginRotationZ = beginRotationZ.getValue() * Math.PI / 180;
    this.animation.data.beginScaleLock = beginScaleLock.getValue();
    this.animation.data.beginScaleX = beginScaleX.getValue();
    this.animation.data.beginScaleY = beginScaleY.getValue();
    this.animation.data.beginScaleZ = beginScaleZ.getValue();
    this.animation.data.ease = ease.getValue();
    this.animation.data.endStatus = endStatus.getValue();
    this.animation.data.endPositionX = endPositionX.getValue();
    this.animation.data.endPositionY = endPositionY.getValue();
    this.animation.data.endPositionZ = endPositionZ.getValue();
    this.animation.data.endRotationX = endRotationX.getValue() * Math.PI / 180;
    this.animation.data.endRotationY = endRotationY.getValue() * Math.PI / 180;
    this.animation.data.endRotationZ = endRotationZ.getValue() * Math.PI / 180;
    this.animation.data.endScaleLock = endScaleLock.getValue();
    this.animation.data.endScaleX = endScaleX.getValue();
    this.animation.data.endScaleY = endScaleY.getValue();
    this.animation.data.endScaleZ = endScaleZ.getValue();

    app.call('animationChanged', this, this.animation);
};

export default TweenAnimationComponent;