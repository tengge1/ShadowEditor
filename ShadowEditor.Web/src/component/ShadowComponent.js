import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 阴影组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ShadowComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

ShadowComponent.prototype = Object.create(BaseComponent.prototype);
ShadowComponent.prototype.constructor = ShadowComponent;

ShadowComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'shadowPanel',
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
                text: '阴影组件'
            }]
        }, {
            xtype: 'row',
            id: 'objectShadowRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '阴影'
            }, {
                xtype: 'boolean',
                id: 'objectCastShadow',
                scope: this.id,
                value: false,
                text: '产生',
                onChange: this.onChangeCastShadow.bind(this)
            }, {
                xtype: 'boolean',
                id: 'objectReceiveShadow',
                scope: this.id,
                value: false,
                text: '接收',
                onChange: this.onChangeReceiveShadow.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectShadowRadiusRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '半径'
            }, {
                xtype: 'number',
                id: 'objectShadowRadius',
                scope: this.id,
                value: 1,
                onChange: this.onChangeShadowRadius.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectMapSizeRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '贴图尺寸'
            }, {
                xtype: 'select',
                id: 'objectMapSize',
                scope: this.id,
                options: {
                    512: '512*512',
                    1024: '1024*1024',
                    2018: '2048*2048'
                },
                value: 512,
                onChange: this.onChangeMapSize.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectBiasRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '偏差'
            }, {
                xtype: 'number',
                id: 'objectBias',
                scope: this.id,
                value: 0,
                range: [0, 1],
                onChange: this.onChangeBias.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectCameraLeftRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '相机左'
            }, {
                xtype: 'number',
                id: 'objectCameraLeft',
                scope: this.id,
                value: -5,
                range: [0, Infinity],
                onChange: this.onChangeCameraLeft.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectCameraRightRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '相机右'
            }, {
                xtype: 'number',
                id: 'objectCameraRight',
                scope: this.id,
                value: 5,
                range: [0, Infinity],
                onChange: this.onChangeCameraRight.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectCameraTopRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '相机上'
            }, {
                xtype: 'number',
                id: 'objectCameraTop',
                scope: this.id,
                value: 5,
                range: [0, Infinity],
                onChange: this.onChangeCameraTop.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectCameraBottomRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '相机下'
            }, {
                xtype: 'number',
                id: 'objectCameraBottom',
                scope: this.id,
                value: -5,
                range: [0, Infinity],
                onChange: this.onChangeCameraBottom.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectCameraNearRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '相机近'
            }, {
                xtype: 'number',
                id: 'objectCameraNear',
                scope: this.id,
                value: 0.5,
                range: [0, Infinity],
                onChange: this.onChangeCameraNear.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectCameraFarRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '相机远'
            }, {
                xtype: 'number',
                id: 'objectCameraFar',
                scope: this.id,
                value: 0.5,
                range: [0, Infinity],
                onChange: this.onChangeCameraFar.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

ShadowComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

ShadowComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

ShadowComponent.prototype.updateUI = function () {
    var container = UI.get('shadowPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && (editor.selected instanceof THREE.Mesh || editor.selected instanceof THREE.DirectionalLight || editor.selected instanceof THREE.PointLight || editor.selected instanceof THREE.SpotLight)) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var objectShadowRadiusRow = UI.get('objectShadowRadiusRow', this.id);
    var objectMapSizeRow = UI.get('objectMapSizeRow', this.id);
    var objectBiasRow = UI.get('objectBiasRow', this.id);
    var objectCameraLeftRow = UI.get('objectCameraLeftRow', this.id);
    var objectCameraRightRow = UI.get('objectCameraRightRow', this.id);
    var objectCameraTopRow = UI.get('objectCameraTopRow', this.id);
    var objectCameraBottomRow = UI.get('objectCameraBottomRow', this.id);
    var objectCameraNearRow = UI.get('objectCameraNearRow', this.id);
    var objectCameraFarRow = UI.get('objectCameraFarRow', this.id);

    var objectCastShadow = UI.get('objectCastShadow', this.id);
    var objectReceiveShadow = UI.get('objectReceiveShadow', this.id);
    var objectShadowRadius = UI.get('objectShadowRadius', this.id);
    var objectMapSize = UI.get('objectMapSize', this.id);
    var objectBias = UI.get('objectBias', this.id);
    var objectCameraLeft = UI.get('objectCameraLeft', this.id);
    var objectCameraRight = UI.get('objectCameraRight', this.id);
    var objectCameraTop = UI.get('objectCameraTop', this.id);
    var objectCameraBottom = UI.get('objectCameraBottom', this.id);
    var objectCameraNear = UI.get('objectCameraNear', this.id);
    var objectCameraFar = UI.get('objectCameraFar', this.id);

    objectCastShadow.setValue(this.selected.castShadow);

    if (this.selected instanceof THREE.Light) {
        objectReceiveShadow.dom.style.display = 'none';
        objectShadowRadiusRow.dom.style.display = '';
        objectMapSizeRow.dom.style.display = '';
        objectBiasRow.dom.style.display = '';
        objectCameraLeftRow.dom.style.display = '';
        objectCameraRightRow.dom.style.display = '';
        objectCameraTopRow.dom.style.display = '';
        objectCameraBottomRow.dom.style.display = '';
        objectCameraNearRow.dom.style.display = '';
        objectCameraFarRow.dom.style.display = '';

        objectShadowRadius.setValue(this.selected.shadow.radius);
        var mapSize = this.selected.shadow.mapSize;
        objectMapSize.setValue(mapSize.x);
        objectBias.setValue(this.selected.shadow.bias);
        objectCameraLeft.setValue(this.selected.shadow.camera.left);
        objectCameraRight.setValue(this.selected.shadow.camera.right);
        objectCameraTop.setValue(this.selected.shadow.camera.top);
        objectCameraBottom.setValue(this.selected.shadow.camera.bottom);
        objectCameraNear.setValue(this.selected.shadow.camera.near);
        objectCameraFar.setValue(this.selected.shadow.camera.far);
    } else {
        objectReceiveShadow.dom.style.display = '';
        objectShadowRadiusRow.dom.style.display = 'none';
        objectMapSizeRow.dom.style.display = 'none';
        objectBiasRow.dom.style.display = 'none';
        objectCameraLeftRow.dom.style.display = 'none';
        objectCameraRightRow.dom.style.display = 'none';
        objectCameraTopRow.dom.style.display = 'none';
        objectCameraBottomRow.dom.style.display = 'none';
        objectCameraNearRow.dom.style.display = 'none';
        objectCameraFarRow.dom.style.display = 'none';

        objectReceiveShadow.setValue(this.selected.receiveShadow);
    }
};

ShadowComponent.prototype.onChangeCastShadow = function () {
    var objectCastShadow = UI.get('objectCastShadow', this.id);
    this.selected.castShadow = objectCastShadow.getValue();
    if (this.selected instanceof THREE.Mesh) {
        this.updateMaterial(this.selected.material);
    }
};

ShadowComponent.prototype.onChangeReceiveShadow = function () {
    var objectReceiveShadow = UI.get('objectReceiveShadow', this.id);
    this.selected.receiveShadow = objectReceiveShadow.getValue();
    if (this.selected instanceof THREE.Mesh) {
        this.updateMaterial(this.selected.material);
    }
};

ShadowComponent.prototype.onChangeShadowRadius = function () {
    var objectShadowRadius = UI.get('objectShadowRadius', this.id);
    this.selected.shadow.radius = objectShadowRadius.getValue();
};

ShadowComponent.prototype.updateMaterial = function (material) {
    if (Array.isArray(material)) {
        material.forEach(n => {
            n.needsUpdate = true;
        });
    } else {
        material.needsUpdate = true;
    }
};

ShadowComponent.prototype.onChangeMapSize = function () {
    var objectMapSize = UI.get('objectMapSize', this.id);
    var mapSize = objectMapSize.getValue();
    this.selected.shadow.mapSize.x = this.selected.shadow.mapSize.y = parseInt(mapSize);
};

ShadowComponent.prototype.onChangeBias = function () {
    var objectBias = UI.get('objectBias', this.id);
    this.selected.shadow.bias = objectBias.getValue();
};

ShadowComponent.prototype.onChangeCameraLeft = function () {
    var objectCameraLeft = UI.get('objectCameraLeft', this.id);
    this.selected.shadow.camera.left = objectCameraLeft.getValue();
    this.selected.shadow.camera.updateProjectionMatrix();
};

ShadowComponent.prototype.onChangeCameraRight = function () {
    var objectCameraRight = UI.get('objectCameraRight', this.id);
    this.selected.shadow.camera.right = objectCameraRight.getValue();
    this.selected.shadow.camera.updateProjectionMatrix();
};

ShadowComponent.prototype.onChangeCameraTop = function () {
    var objectCameraTop = UI.get('objectCameraTop', this.id);
    this.selected.shadow.camera.top = objectCameraTop.getValue();
    this.selected.shadow.camera.updateProjectionMatrix();
};

ShadowComponent.prototype.onChangeCameraBottom = function () {
    var objectCameraBottom = UI.get('objectCameraBottom', this.id);
    this.selected.shadow.camera.bottom = objectCameraBottom.getValue();
    this.selected.shadow.camera.updateProjectionMatrix();
};

ShadowComponent.prototype.onChangeCameraNear = function () {
    var objectCameraNear = UI.get('objectCameraNear', this.id);
    this.selected.shadow.camera.near = objectCameraNear.getValue();
    this.selected.shadow.camera.updateProjectionMatrix();
};

ShadowComponent.prototype.onChangeCameraFar = function () {
    var objectCameraFar = UI.get('objectCameraFar', this.id);
    this.selected.shadow.camera.far = objectCameraFar.getValue();
    this.selected.shadow.camera.updateProjectionMatrix();
};

export default ShadowComponent;