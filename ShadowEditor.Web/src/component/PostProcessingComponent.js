import BaseComponent from './BaseComponent';

/**
 * 后期处理组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function PostProcessingComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

PostProcessingComponent.prototype = Object.create(BaseComponent.prototype);
PostProcessingComponent.prototype.constructor = PostProcessingComponent;

PostProcessingComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'panel',
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
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '特效'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '点阵化'
            }, {
                xtype: 'checkbox',
                id: 'dotScreen',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'dotScreenScale',
                scope: this.id,
                value: 4,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '颜色偏移'
            }, {
                xtype: 'checkbox',
                id: 'rgbShift',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'rgbShiftAmount',
                scope: this.id,
                value: 0.1,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '残影'
            }, {
                xtype: 'checkbox',
                id: 'afterimage',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'afterimageDamp',
                scope: this.id,
                value: 0.96,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            style: {
                borderTop: '1px solid #ddd'
            },
            children: [{
                xtype: 'label',
                text: '背景虚化'
            }, {
                xtype: 'checkbox',
                id: 'bokeh',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '焦点'
            }, {
                xtype: 'number',
                id: 'bokehFocus',
                scope: this.id,
                value: 1,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '光圈'
            }, {
                xtype: 'number',
                id: 'bokehAperture',
                scope: this.id,
                value: 0.025,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '最大模糊'
            }, {
                xtype: 'number',
                id: 'bokehMaxBlur',
                scope: this.id,
                value: 0.05,
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

PostProcessingComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

PostProcessingComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

PostProcessingComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Scene) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var dotScreen = UI.get('dotScreen', this.id);
    var dotScreenScale = UI.get('dotScreenScale', this.id);
    var rgbShift = UI.get('rgbShift', this.id);
    var rgbShiftAmount = UI.get('rgbShiftAmount', this.id);
    var afterimage = UI.get('afterimage', this.id);
    var afterimageDamp = UI.get('afterimageDamp', this.id);
    var bokeh = UI.get('bokeh', this.id);
    var bokehFocus = UI.get('bokehFocus', this.id);
    var bokehAperture = UI.get('bokehAperture', this.id);
    var bokehMaxBlur = UI.get('bokehMaxBlur', this.id);

    var scene = this.selected;
    var postProcessing = scene.userData.postProcessing || {};

    if (postProcessing.dotScreen) {
        dotScreen.setValue(postProcessing.dotScreen.enabled);
        dotScreenScale.setValue(postProcessing.dotScreen.scale);
    }

    if (postProcessing.rgbShift) {
        rgbShift.setValue(postProcessing.rgbShift.enabled);
        rgbShiftAmount.setValue(postProcessing.rgbShift.amount);
    }

    if (postProcessing.afterimage) {
        afterimage.setValue(postProcessing.afterimage.enabled);
        afterimageDamp.setValue(postProcessing.afterimage.damp);
    }

    if (postProcessing.bokeh) {
        bokeh.setValue(postProcessing.bokeh.enabled);
        bokehFocus.setValue(postProcessing.bokeh.focus);
        bokehAperture.setValue(postProcessing.bokeh.aperture);
        bokehMaxBlur.setValue(postProcessing.bokeh.maxBlur);
    }
};

PostProcessingComponent.prototype.onChange = function () {
    var dotScreen = UI.get('dotScreen', this.id);
    var dotScreenScale = UI.get('dotScreenScale', this.id);
    var rgbShift = UI.get('rgbShift', this.id);
    var rgbShiftAmount = UI.get('rgbShiftAmount', this.id);
    var afterimage = UI.get('afterimage', this.id);
    var afterimageDamp = UI.get('afterimageDamp', this.id);
    var bokeh = UI.get('bokeh', this.id);
    var bokehFocus = UI.get('bokehFocus', this.id);
    var bokehAperture = UI.get('bokehAperture', this.id);
    var bokehMaxBlur = UI.get('bokehMaxBlur', this.id);

    var scene = this.selected;
    scene.userData.postProcessing = scene.userData.postProcessing || {};

    Object.assign(scene.userData.postProcessing, {
        dotScreen: {
            enabled: dotScreen.getValue(),
            scale: dotScreenScale.getValue(),
        },
        rgbShift: {
            enabled: rgbShift.getValue(),
            amount: rgbShiftAmount.getValue()
        },
        afterimage: {
            enabled: afterimage.getValue(),
            damp: afterimageDamp.getValue()
        },
        bokeh: {
            enabled: bokeh.getValue(),
            focus: bokehFocus.getValue(),
            aperture: bokehAperture.getValue(),
            maxBlur: bokehMaxBlur.getValue(),
        },
    });
};

export default PostProcessingComponent;