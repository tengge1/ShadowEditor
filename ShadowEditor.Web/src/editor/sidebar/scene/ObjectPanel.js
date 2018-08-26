import UI from '../../../ui/UI';
import SetUuidCommand from '../../../command/SetUuidCommand';
import SetValueCommand from '../../../command/SetValueCommand';

/**
 * 物体面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function ObjectPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

ObjectPanel.prototype = Object.create(UI.Control.prototype);
ObjectPanel.prototype.constructor = ObjectPanel;

ObjectPanel.prototype.render = function () {
    var editor = this.app.editor;

    var _this = this;

    var update = function () {
        _this.app.call('updateObject', _this);
    };

    var data = {
        xtype: 'div',
        id: 'objectPanel',
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: 0,
            paddingTop: '20px',
            display: 'none'
        },
        children: [{ // type
            xtype: 'row',
            id: 'objectTypeRow',
            children: [{
                xtype: 'label',
                text: '类型'
            }, {
                xtype: 'text',
                id: 'objectType'
            }]
        }, { // uuid
            xtype: 'row',
            id: 'objectUUIDRow',
            children: [{
                xtype: 'label',
                text: 'UUID'
            }, {
                xtype: 'input',
                id: 'objectUUID',
                style: {
                    width: '102px',
                    fontSize: '12px'
                },
                disabled: true
            }, {
                xtype: 'button',
                id: 'objectUUIDRenew',
                text: '新建',
                style: {
                    marginLeft: '7px'
                },
                onClick: function () {
                    var objectUUID = UI.get('objectUUID');
                    objectUUID.setValue(THREE.Math.generateUUID());
                    editor.execute(new SetUuidCommand(editor.selected, objectUUID.getValue()));
                }
            }]
        }, { // name
            xtype: 'row',
            id: 'objectNameRow',
            children: [{
                xtype: 'label',
                text: '名称'
            }, {
                xtype: 'input',
                id: 'objectName',
                style: {
                    width: '150px',
                    fontSize: '12px'
                },
                onChange: function () {
                    editor.execute(new SetValueCommand(editor.selected, 'name', this.getValue()));
                }
            }]
        }, { // position
            xtype: 'row',
            id: 'objectPositionRow',
            children: [{
                xtype: 'label',
                text: '位置'
            }, {
                xtype: 'number',
                id: 'objectPositionX',
                style: {
                    width: '50px'
                },
                onChange: update
            }, {
                xtype: 'number',
                id: 'objectPositionY',
                style: {
                    width: '50px'
                },
                onChange: update
            }, {
                xtype: 'number',
                id: 'objectPositionZ',
                style: {
                    width: '50px'
                },
                onChange: update
            }]
        }, { // rotation
            xtype: 'row',
            id: 'objectRotationRow',
            children: [{
                xtype: 'label',
                text: '旋转'
            }, {
                xtype: 'number',
                id: 'objectRotationX',
                step: 10,
                unit: '°',
                style: {
                    width: '50px'
                },
                onChange: update
            }, {
                xtype: 'number',
                id: 'objectRotationY',
                step: 10,
                unit: '°',
                style: {
                    width: '50px'
                },
                onChange: update
            }, {
                xtype: 'number',
                id: 'objectRotationZ',
                step: 10,
                unit: '°',
                style: {
                    width: '50px'
                },
                onChange: update
            }]
        }, { // scale
            xtype: 'row',
            id: 'objectScaleRow',
            children: [{
                xtype: 'label',
                text: '尺寸'
            }, {
                xtype: 'checkbox',
                id: 'objectScaleLock',
                value: true,
                style: {
                    position: 'absolute',
                    left: '75px'
                }
            }, {
                xtype: 'number',
                id: 'objectScaleX',
                value: 1,
                range: [0.01, Infinity],
                style: {
                    width: '50px'
                },
                onChange: function () {
                    _this.app.call('updateScaleX', _this);
                }
            }, {
                xtype: 'number',
                id: 'objectScaleY',
                value: 1,
                range: [0.01, Infinity],
                style: {
                    width: '50px'
                },
                onChange: function () {
                    _this.app.call('updateScaleY', _this);
                }
            }, {
                xtype: 'number',
                id: 'objectScaleZ',
                value: 1,
                range: [0.01, Infinity],
                style: {
                    width: '50px'
                },
                onChange: function () {
                    _this.app.call('updateScaleZ', _this);
                }
            }]
        }, { // fov
            xtype: 'row',
            id: 'objectFovRow',
            children: [{
                xtype: 'label',
                text: '视场'
            }, {
                xtype: 'number',
                id: 'objectFov',
                onChange: update
            }]
        }, { // near
            xtype: 'row',
            id: 'objectNearRow',
            children: [{
                xtype: 'label',
                text: '近点'
            }, {
                xtype: 'number',
                id: 'objectNear',
                onChange: update
            }]
        }, { // far
            xtype: 'row',
            id: 'objectFarRow',
            children: [{
                xtype: 'label',
                text: '远点'
            }, {
                xtype: 'number',
                id: 'objectFar',
                onChange: update
            }]
        }, { // intensity
            xtype: 'row',
            id: 'objectIntensityRow',
            children: [{
                xtype: 'label',
                text: '强度'
            }, {
                xtype: 'number',
                id: 'objectIntensity',
                range: [0, Infinity],
                onChange: update
            }]
        }, { // color
            xtype: 'row',
            id: 'objectColorRow',
            children: [{
                xtype: 'label',
                text: '颜色'
            }, {
                xtype: 'color',
                id: 'objectColor',
                onChange: update
            }]
        }, { // ground color
            xtype: 'row',
            id: 'objectGroundColorRow',
            children: [{
                xtype: 'label',
                text: '地面颜色'
            }, {
                xtype: 'color',
                id: 'objectGroundColor',
                onChange: update
            }]
        }, { // distance
            xtype: 'row',
            id: 'objectDistanceRow',
            children: [{
                xtype: 'label',
                text: '距离'
            }, {
                xtype: 'number',
                id: 'objectDistance',
                range: [0, Infinity],
                onChange: update
            }]
        }, { // angle
            xtype: 'row',
            id: 'objectAngleRow',
            children: [{
                xtype: 'label',
                text: '角度'
            }, {
                xtype: 'number',
                id: 'objectAngle',
                precision: 3,
                range: [0, Math.PI / 2],
                onChange: update
            }]
        }, { // penumbra
            xtype: 'row',
            id: 'objectPenumbraRow',
            children: [{
                xtype: 'label',
                text: '边缘'
            }, {
                xtype: 'number',
                id: 'objectPenumbra',
                range: [0, 1],
                onChange: update
            }]
        }, { // decay
            xtype: 'row',
            id: 'objectDecayRow',
            children: [{
                xtype: 'label',
                text: '衰变'
            }, {
                xtype: 'number',
                id: 'objectDecay',
                range: [0, Infinity],
                onChange: update
            }]
        }, { // shadow
            xtype: 'row',
            id: 'objectShadowRow',
            children: [{
                xtype: 'label',
                text: '阴影'
            }, {
                xtype: 'boolean',
                id: 'objectCastShadow',
                value: false,
                text: '产生',
                onChange: update
            }, {
                xtype: 'boolean',
                id: 'objectReceiveShadow',
                value: false,
                text: '接收',
                onChange: update
            }, {
                xtype: 'number',
                id: 'objectShadowRadius',
                value: 1,
                onChange: update
            }]
        }, {
            xtype: 'row',
            id: 'objectReflectorRow',
            children: [{
                xtype: 'label',
                text: '镜面'
            }, {
                xtype: 'checkbox',
                id: 'objectReflector',
                onChange: update
            }]
        }, { // visible
            xtype: 'row',
            id: 'objectVisibleRow',
            children: [{
                xtype: 'label',
                text: '可见性'
            }, {
                xtype: 'checkbox',
                id: 'objectVisible',
                onChange: update
            }]
        }, { // user data
            xtype: 'row',
            id: 'objectUserDataRow',
            children: [{
                xtype: 'label',
                text: '用户数据'
            }, {
                xtype: 'textarea',
                id: 'objectUserData',
                style: {
                    width: '150px',
                    height: '40px',
                    fontSize: '12px'
                },
                onChange: update,
                onKeyUp: function () {
                    try {
                        JSON.parse(this.getValue());
                        this.dom.classList.add('success');
                        this.dom.classList.remove('fail');
                    } catch (error) {
                        this.dom.classList.remove('success');
                        this.dom.classList.add('fail');
                    }
                }
            }]
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default ObjectPanel;