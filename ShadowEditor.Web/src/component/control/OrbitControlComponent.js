import BaseComponent from '../BaseComponent';

/**
 * 轨道控制器组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function OrbitControlComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

OrbitControlComponent.prototype = Object.create(BaseComponent.prototype);
OrbitControlComponent.prototype.constructor = OrbitControlComponent;

OrbitControlComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'controlPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: '1px solid #ddd',
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold',
                    width: '100%'
                },
                text: L_ORBIT_CONTROLS
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MIN_DISTANCE
            }, {
                xtype: 'number',
                id: 'minDistance',
                scope: this.id,
                value: 0.0,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MAX_DISTANCE
            }, {
                xtype: 'number',
                id: 'maxDistance',
                scope: this.id,
                value: 100000,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MIN_POLAR_ANGLE
            }, {
                xtype: 'number',
                id: 'minPolarAngle',
                scope: this.id,
                value: 100000,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MAX_POLAR_ANGLE
            }, {
                xtype: 'number',
                id: 'maxPolarAngle',
                scope: this.id,
                value: 3.14,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MIN_AZIMUTH_ANGLE
            }, {
                xtype: 'number',
                id: 'minAzimuthAngle',
                scope: this.id,
                value: -100,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MAX_AZIMUTH_ANGLE
            }, {
                xtype: 'number',
                id: 'maxAzimuthAngle',
                scope: this.id,
                value: 100,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ENABLE_DAMPING
            }, {
                xtype: 'checkbox',
                id: 'enableDamping',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_DAMPING_FACTOR
            }, {
                xtype: 'number',
                id: 'dampingFactor',
                scope: this.id,
                value: 0.25,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ENABLE_ZOOM
            }, {
                xtype: 'checkbox',
                id: 'enableZoom',
                scope: this.id,
                value: true,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ZOOM_SPEED
            }, {
                xtype: 'number',
                id: 'zoomSpeed',
                scope: this.id,
                value: true,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ENABLE_ROTATE
            }, {
                xtype: 'checkbox',
                id: 'enableRotate',
                scope: this.id,
                value: true,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ROTATE_SPEED
            }, {
                xtype: 'number',
                id: 'rotateSpeed',
                scope: this.id,
                value: 1.0,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ENABLE_PAN
            }, {
                xtype: 'checkbox',
                id: 'enablePan',
                scope: this.id,
                value: true,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_PAN_SPEED
            }, {
                xtype: 'number',
                id: 'panSpeed',
                scope: this.id,
                value: 1.0,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_SCREEN_SPACE_PANNING
            }, {
                xtype: 'checkbox',
                id: 'screenSpacePanning',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_KEY_PAN_SPEED
            }, {
                xtype: 'number',
                id: 'keyPanSpeed',
                scope: this.id,
                value: 7.0,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_AUTO_ROTATE
            }, {
                xtype: 'checkbox',
                id: 'autoRotate',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_AUTO_ROTATE_SPEED
            }, {
                xtype: 'number',
                id: 'autoRotateSpeed',
                scope: this.id,
                value: 2.0,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ENABLE_KEYS
            }, {
                xtype: 'checkbox',
                id: 'enableKeys',
                scope: this.id,
                value: true,
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

OrbitControlComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

OrbitControlComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

OrbitControlComponent.prototype.updateUI = function () {
    var container = UI.get('controlPanel', this.id);
    var editor = app.editor;
    if (editor.selected && editor.selected === app.editor.camera && editor.selected.userData.control === 'OrbitControls') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var minDistance = UI.get('minDistance', this.id);
    var maxDistance = UI.get('maxDistance', this.id);
    var minPolarAngle = UI.get('minPolarAngle', this.id);
    var maxPolarAngle = UI.get('maxPolarAngle', this.id);
    var minAzimuthAngle = UI.get('minAzimuthAngle', this.id);
    var maxAzimuthAngle = UI.get('maxAzimuthAngle', this.id);
    var enableDamping = UI.get('enableDamping', this.id);
    var dampingFactor = UI.get('dampingFactor', this.id);
    var enableZoom = UI.get('enableZoom', this.id);
    var zoomSpeed = UI.get('zoomSpeed', this.id);
    var enableRotate = UI.get('enableRotate', this.id);
    var rotateSpeed = UI.get('rotateSpeed', this.id);
    var enablePan = UI.get('enablePan', this.id);
    var panSpeed = UI.get('panSpeed', this.id);
    var screenSpacePanning = UI.get('screenSpacePanning', this.id);
    var keyPanSpeed = UI.get('keyPanSpeed', this.id);
    var autoRotate = UI.get('autoRotate', this.id);
    var autoRotateSpeed = UI.get('autoRotateSpeed', this.id);
    var enableKeys = UI.get('enableKeys', this.id);

    var options = this.selected.userData.orbitOptions || {
        minDistance: 0,
        maxDistance: 99999,
        minPolarAngle: 0,
        maxPolarAngle: Math.PI,
        minAzimuthAngle: - 9999,
        maxAzimuthAngle: 9999,
        enableDamping: false,
        dampingFactor: 0.25,
        enableZoom: true,
        zoomSpeed: 1.0,
        enableRotate: true,
        rotateSpeed: 1.0,
        enablePan: true,
        panSpeed: 1.0,
        screenSpacePanning: false,
        keyPanSpeed: 7.0,
        autoRotate: false,
        autoRotateSpeed: 2.0,
        enableKeys: true,
    };

    if (this.selected.userData.orbitOptions === undefined) {
        this.selected.userData.orbitOptions = {};
        Object.assign(this.selected.userData.orbitOptions, options);
    }

    minDistance.setValue(options.minDistance);
    maxDistance.setValue(options.maxDistance);
    minPolarAngle.setValue(options.minPolarAngle);
    maxPolarAngle.setValue(options.maxPolarAngle);
    minAzimuthAngle.setValue(options.minAzimuthAngle);
    maxAzimuthAngle.setValue(options.maxAzimuthAngle);
    enableDamping.setValue(options.enableDamping);
    dampingFactor.setValue(options.dampingFactor);
    enableZoom.setValue(options.enableZoom);
    zoomSpeed.setValue(options.zoomSpeed);
    enableRotate.setValue(options.enableRotate);
    rotateSpeed.setValue(options.rotateSpeed);
    enablePan.setValue(options.enablePan);
    panSpeed.setValue(options.panSpeed);
    screenSpacePanning.setValue(options.screenSpacePanning);
    keyPanSpeed.setValue(options.keyPanSpeed);
    autoRotate.setValue(options.autoRotate);
    autoRotateSpeed.setValue(options.autoRotateSpeed);
    enableKeys.setValue(options.enableKeys);
};

OrbitControlComponent.prototype.onChange = function () {
    var minDistance = UI.get('minDistance', this.id);
    var maxDistance = UI.get('maxDistance', this.id);
    var minPolarAngle = UI.get('minPolarAngle', this.id);
    var maxPolarAngle = UI.get('maxPolarAngle', this.id);
    var minAzimuthAngle = UI.get('minAzimuthAngle', this.id);
    var maxAzimuthAngle = UI.get('maxAzimuthAngle', this.id);
    var enableDamping = UI.get('enableDamping', this.id);
    var dampingFactor = UI.get('dampingFactor', this.id);
    var enableZoom = UI.get('enableZoom', this.id);
    var zoomSpeed = UI.get('zoomSpeed', this.id);
    var enableRotate = UI.get('enableRotate', this.id);
    var rotateSpeed = UI.get('rotateSpeed', this.id);
    var enablePan = UI.get('enablePan', this.id);
    var panSpeed = UI.get('panSpeed', this.id);
    var screenSpacePanning = UI.get('screenSpacePanning', this.id);
    var keyPanSpeed = UI.get('keyPanSpeed', this.id);
    var autoRotate = UI.get('autoRotate', this.id);
    var autoRotateSpeed = UI.get('autoRotateSpeed', this.id);
    var enableKeys = UI.get('enableKeys', this.id);

    Object.assign(this.selected.userData.orbitOptions, {
        minDistance: minDistance.getValue(),
        maxDistance: maxDistance.getValue(),
        minPolarAngle: minPolarAngle.getValue(),
        maxPolarAngle: maxPolarAngle.getValue(),
        minAzimuthAngle: minAzimuthAngle.getValue(),
        maxAzimuthAngle: maxAzimuthAngle.getValue(),
        enableDamping: enableDamping.getValue(),
        dampingFactor: dampingFactor.getValue(),
        enableZoom: enableZoom.getValue(),
        zoomSpeed: zoomSpeed.getValue(),
        enableRotate: enableRotate.getValue(),
        rotateSpeed: rotateSpeed.getValue(),
        enablePan: enablePan.getValue(),
        panSpeed: panSpeed.getValue(),
        screenSpacePanning: screenSpacePanning.getValue(),
        keyPanSpeed: keyPanSpeed.getValue(),
        autoRotate: autoRotate.getValue(),
        autoRotateSpeed: autoRotateSpeed.getValue(),
        enableKeys: enableKeys.getValue(),
    });
};

export default OrbitControlComponent;