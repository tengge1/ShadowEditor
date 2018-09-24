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
                text: '补间动画'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '开始状态'
            }, {
                xtype: 'select',
                id: 'startStatus',
                scope: this.id,
                options: {
                    Current: '当前位置',
                    Custom: '自定义'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '平移'
            }, {
                xtype: 'number',
                id: 'startPositionX',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'startPositionY',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'startPositionZ',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '旋转'
            }, {
                xtype: 'number',
                id: 'startRotationX',
                scope: this.id,
                step: 10,
                unit: '°',
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'startRotationY',
                scope: this.id,
                step: 10,
                unit: '°',
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'startRotationZ',
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
            children: [{
                xtype: 'label',
                text: '缩放'
            }, {
                xtype: 'checkbox',
                id: 'startScaleLock',
                scope: this.id,
                value: true,
                style: {
                    position: 'absolute',
                    left: '50px'
                }
            }, {
                xtype: 'number',
                id: 'startScaleX',
                scope: this.id,
                value: 1,
                range: [0.01, Infinity],
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'startScaleY',
                scope: this.id,
                value: 1,
                range: [0.01, Infinity],
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'startScaleZ',
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
                text: '结束状态'
            }, {
                xtype: 'select',
                id: 'endStatus',
                scope: this.id,
                options: {
                    Current: '当前位置',
                    Custom: '自定义'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '平移'
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
            children: [{
                xtype: 'label',
                text: '旋转'
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
            children: [{
                xtype: 'label',
                text: '缩放'
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

    this.app.on(`animationSelected.${this.id}`, this.onAnimationSelected.bind(this));
    this.app.on(`animationChanged.${this.id}`, this.onAnimationChanged.bind(this));
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
};

TweenAnimationComponent.prototype.onChange = function () {

    this.app.call('animationChanged', this, this.animation);
};

export default TweenAnimationComponent;