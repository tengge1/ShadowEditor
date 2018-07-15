import BaseEvent from '../BaseEvent';
import XType from '../../ui/XType';
import SetPositionCommand from '../../command/SetPositionCommand';
import SetRotationCommand from '../../command/SetRotationCommand';
import SetScaleCommand from '../../command/SetScaleCommand';
import SetUuidCommand from '../../command/SetUuidCommand';
import SetValueCommand from '../../command/SetValueCommand';
import SetColorCommand from '../../command/SetColorCommand';

/**
 * 物体面板事件
 * @param {*} app 
 */
function ObjectPanelEvent(app) {
    BaseEvent.call(this, app);
}

ObjectPanelEvent.prototype = Object.create(BaseEvent.prototype);
ObjectPanelEvent.prototype.constructor = ObjectPanelEvent;

ObjectPanelEvent.prototype.start = function () {
    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
    this.app.on(`refreshSidebarObject3D.${this.id}`, this.onRefreshSidebarObject3D.bind(this));
    this.app.on(`updateScaleX.${this.id}`, this.updateScaleX.bind(this));
    this.app.on(`updateScaleY.${this.id}`, this.updateScaleY.bind(this));
    this.app.on(`updateScaleZ.${this.id}`, this.updateScaleZ.bind(this));
    this.app.on(`updateObject.${this.id}`, this.update.bind(this));
    this.app.on(`updateObjectPanel.${this.id}`, this.updateUI.bind(this));
};

ObjectPanelEvent.prototype.stop = function () {
    this.app.on(`objectSelected.${this.id}`, null);
    this.app.on(`objectChanged.${this.id}`, null);
    this.app.on(`refreshSidebarObject3D.${this.id}`, null);
    this.app.on(`updateScaleX.${this.id}`, null);
    this.app.on(`updateScaleY.${this.id}`, null);
    this.app.on(`updateScaleZ.${this.id}`, null);
    this.app.on(`updateObject.${this.id}`, null);
    this.app.on(`updateObjectPanel.${this.id}`, null);
};

/**
 * 物体选中事件
 * @param {*} object 
 */
ObjectPanelEvent.prototype.onObjectSelected = function (object) {
    var container = XType.getControl('objectPanel');

    if (object !== null) {
        container.dom.style.display = 'block';
        this.updateRows(object);
        this.app.call('updateObjectPanel', this, object);
    } else {
        container.dom.style.display = 'none';
    }
};

/**
 * 选中物体改变
 * @param {*} object 
 */
ObjectPanelEvent.prototype.onObjectChanged = function (object) {
    var editor = this.app.editor;
    if (object !== editor.selected) return;

    this.app.call('updateObjectPanel', this, object);
};

/**
 * 刷新物体面板
 * @param {*} object 
 */
ObjectPanelEvent.prototype.onRefreshSidebarObject3D = function (object) {
    var editor = this.app.editor;
    if (object !== editor.selected) return;

    this.app.call('updateObjectPanel', this, object);
};

/**
 * 更新物体缩放x
 */
ObjectPanelEvent.prototype.updateScaleX = function () {
    var editor = this.app.editor;
    var object = editor.selected;
    var objectScaleLock = XType.getControl('objectScaleLock');
    var objectScaleX = XType.getControl('objectScaleX');
    var objectScaleY = XType.getControl('objectScaleY');
    var objectScaleZ = XType.getControl('objectScaleZ');

    if (objectScaleLock.getValue() === true) {
        var scale = objectScaleX.getValue() / object.scale.x;
        objectScaleY.setValue(objectScaleY.getValue() * scale);
        objectScaleZ.setValue(objectScaleZ.getValue() * scale);
    }

    this.app.call('updateObject', this);
};

/**
 * 更新物体缩放y
 */
ObjectPanelEvent.prototype.updateScaleY = function () {
    var editor = this.app.editor;
    var object = editor.selected;
    var objectScaleLock = XType.getControl('objectScaleLock');
    var objectScaleX = XType.getControl('objectScaleX');
    var objectScaleY = XType.getControl('objectScaleY');
    var objectScaleZ = XType.getControl('objectScaleZ');

    if (objectScaleLock.getValue() === true) {
        var scale = objectScaleY.getValue() / object.scale.y;

        objectScaleX.setValue(objectScaleX.getValue() * scale);
        objectScaleZ.setValue(objectScaleZ.getValue() * scale);
    }

    this.app.call('updateObject', this);
};

/**
 * 更新物体缩放z
 */
ObjectPanelEvent.prototype.updateScaleZ = function () {
    var editor = this.app.editor;
    var object = editor.selected;
    var objectScaleLock = XType.getControl('objectScaleLock');
    var objectScaleX = XType.getControl('objectScaleX');
    var objectScaleY = XType.getControl('objectScaleY');
    var objectScaleZ = XType.getControl('objectScaleZ');

    if (objectScaleLock.getValue() === true) {
        var scale = objectScaleZ.getValue() / object.scale.z;

        objectScaleX.setValue(objectScaleX.getValue() * scale);
        objectScaleY.setValue(objectScaleY.getValue() * scale);
    }

    this.app.call('updateObject', this);
};

/**
 * 更新物体面板更新物体属性
 */
ObjectPanelEvent.prototype.update = function () {
    var editor = this.app.editor;
    var object = editor.selected;

    var objectPositionX = XType.getControl('objectPositionX');
    var objectPositionY = XType.getControl('objectPositionY');
    var objectPositionZ = XType.getControl('objectPositionZ');
    var objectRotationX = XType.getControl('objectRotationX');
    var objectRotationY = XType.getControl('objectRotationY');
    var objectRotationZ = XType.getControl('objectRotationZ');
    var objectScaleX = XType.getControl('objectScaleX');
    var objectScaleY = XType.getControl('objectScaleY');
    var objectScaleZ = XType.getControl('objectScaleZ');
    var objectFov = XType.getControl('objectFov');
    var objectNear = XType.getControl('objectNear');
    var objectFar = XType.getControl('objectFar');
    var objectIntensity = XType.getControl('objectIntensity');
    var objectColor = XType.getControl('objectColor');
    var objectGroundColor = XType.getControl('objectGroundColor');
    var objectDistance = XType.getControl('objectDistance');
    var objectAngle = XType.getControl('objectAngle');
    var objectPenumbra = XType.getControl('objectPenumbra');
    var objectDecay = XType.getControl('objectDecay');
    var objectVisible = XType.getControl('objectVisible');
    var objectCastShadow = XType.getControl('objectCastShadow');
    var objectReceiveShadow = XType.getControl('objectReceiveShadow');
    var objectShadowRadius = XType.getControl('objectShadowRadius');
    var objectUserData = XType.getControl('objectUserData');

    if (object !== null) {
        var newPosition = new THREE.Vector3(objectPositionX.getValue(), objectPositionY.getValue(), objectPositionZ.getValue());

        if (object.position.distanceTo(newPosition) >= 0.01) {
            editor.execute(new SetPositionCommand(object, newPosition));
        }

        var newRotation = new THREE.Euler(
            objectRotationX.getValue() * THREE.Math.DEG2RAD,
            objectRotationY.getValue() * THREE.Math.DEG2RAD,
            objectRotationZ.getValue() * THREE.Math.DEG2RAD);
        if (object.rotation.toVector3().distanceTo(newRotation.toVector3()) >= 0.01) {
            editor.execute(new SetRotationCommand(object, newRotation));
        }

        var newScale = new THREE.Vector3(objectScaleX.getValue(), objectScaleY.getValue(), objectScaleZ.getValue());
        if (object.scale.distanceTo(newScale) >= 0.01) {
            editor.execute(new SetScaleCommand(object, newScale));
        }

        if (object.fov !== undefined && Math.abs(object.fov - objectFov.getValue()) >= 0.01) {
            editor.execute(new SetValueCommand(object, 'fov', objectFov.getValue()));
            object.updateProjectionMatrix();
        }

        if (object.near !== undefined && Math.abs(object.near - objectNear.getValue()) >= 0.01) {
            editor.execute(new SetValueCommand(object, 'near', objectNear.getValue()));
        }

        if (object.far !== undefined && Math.abs(object.far - objectFar.getValue()) >= 0.01) {
            editor.execute(new SetValueCommand(object, 'far', objectFar.getValue()));
        }

        if (object.intensity !== undefined && Math.abs(object.intensity - objectIntensity.getValue()) >= 0.01) {
            editor.execute(new SetValueCommand(object, 'intensity', objectIntensity.getValue()));
        }

        if (object.color !== undefined && object.color.getHex() !== objectColor.getHexValue()) {
            editor.execute(new SetColorCommand(object, 'color', objectColor.getHexValue()));
        }

        if (object.groundColor !== undefined && object.groundColor.getHex() !== objectGroundColor.getHexValue()) {
            editor.execute(new SetColorCommand(object, 'groundColor', objectGroundColor.getHexValue()));
        }

        if (object.distance !== undefined && Math.abs(object.distance - objectDistance.getValue()) >= 0.01) {
            editor.execute(new SetValueCommand(object, 'distance', objectDistance.getValue()));
        }

        if (object.angle !== undefined && Math.abs(object.angle - objectAngle.getValue()) >= 0.01) {
            editor.execute(new SetValueCommand(object, 'angle', objectAngle.getValue()));
        }

        if (object.penumbra !== undefined && Math.abs(object.penumbra - objectPenumbra.getValue()) >= 0.01) {
            editor.execute(new SetValueCommand(object, 'penumbra', objectPenumbra.getValue()));
        }

        if (object.decay !== undefined && Math.abs(object.decay - objectDecay.getValue()) >= 0.01) {
            editor.execute(new SetValueCommand(object, 'decay', objectDecay.getValue()));
        }

        if (object.visible !== objectVisible.getValue()) {
            editor.execute(new SetValueCommand(object, 'visible', objectVisible.getValue()));
        }

        if (object.castShadow !== undefined && object.castShadow !== objectCastShadow.getValue()) {
            editor.execute(new SetValueCommand(object, 'castShadow', objectCastShadow.getValue()));
        }

        if (object.receiveShadow !== undefined && object.receiveShadow !== objectReceiveShadow.getValue()) {
            editor.execute(new SetValueCommand(object, 'receiveShadow', objectReceiveShadow.getValue()));
            object.material.needsUpdate = true;
        }

        if (object.shadow !== undefined) {
            if (object.shadow.radius !== objectShadowRadius.getValue()) {
                editor.execute(new SetValueCommand(object.shadow, 'radius', objectShadowRadius.getValue()));
            }
        }

        try {
            var userData = JSON.parse(objectUserData.getValue());

            if (JSON.stringify(object.userData) != JSON.stringify(userData)) {
                editor.execute(new SetValueCommand(object, 'userData', userData));
            }
        } catch (exception) {
            console.warn(exception);
        }
    }
};

/**
 * 控制每行显示隐藏
 * @param {*} object 
 */
ObjectPanelEvent.prototype.updateRows = function (object) {
    var objectFovRow = XType.getControl('objectFovRow');
    var objectNearRow = XType.getControl('objectNearRow');
    var objectFarRow = XType.getControl('objectFarRow');
    var objectIntensityRow = XType.getControl('objectIntensityRow');
    var objectColorRow = XType.getControl('objectColorRow');
    var objectGroundColorRow = XType.getControl('objectGroundColorRow');
    var objectDistanceRow = XType.getControl('objectDistanceRow');
    var objectAngleRow = XType.getControl('objectAngleRow');
    var objectPenumbraRow = XType.getControl('objectPenumbraRow');
    var objectDecayRow = XType.getControl('objectDecayRow');
    var objectShadowRow = XType.getControl('objectShadowRow');
    var objectReceiveShadow = XType.getControl('objectReceiveShadow');
    var objectShadowRadius = XType.getControl('objectShadowRadius');

    var properties = {
        'fov': objectFovRow,
        'near': objectNearRow,
        'far': objectFarRow,
        'intensity': objectIntensityRow,
        'color': objectColorRow,
        'groundColor': objectGroundColorRow,
        'distance': objectDistanceRow,
        'angle': objectAngleRow,
        'penumbra': objectPenumbraRow,
        'decay': objectDecayRow,
        'castShadow': objectShadowRow,
        'receiveShadow': objectReceiveShadow,
        'shadow': objectShadowRadius
    };

    for (var property in properties) {
        properties[property].dom.style.display = object[property] !== undefined ? '' : 'none';
    }
};

/**
 * 更新平移旋转缩放面板
 * @param {*} object 
 */
ObjectPanelEvent.prototype.updateTransformRows = function (object) {
    var objectRotationRow = XType.getControl('objectRotationRow');
    var objectScaleRow = XType.getControl('objectScaleRow');

    if (object instanceof THREE.Light || (object instanceof THREE.Object3D && object.userData.targetInverse)) {
        objectRotationRow.dom.style.display = 'none';
        objectScaleRow.dom.style.display = 'none';
    } else {
        objectRotationRow.dom.style.display = '';
        objectScaleRow.dom.style.display = '';
    }
}

/**
 * 刷新物体面板ui
 * @param {*} object 
 */
ObjectPanelEvent.prototype.updateUI = function (object) {
    var objectType = XType.getControl('objectType');
    var objectUUID = XType.getControl('objectUUID');
    var objectName = XType.getControl('objectName');
    var objectPositionX = XType.getControl('objectPositionX');
    var objectPositionY = XType.getControl('objectPositionY');
    var objectPositionZ = XType.getControl('objectPositionZ');
    var objectRotationX = XType.getControl('objectRotationX');
    var objectRotationY = XType.getControl('objectRotationY');
    var objectRotationZ = XType.getControl('objectRotationZ');
    var objectScaleX = XType.getControl('objectScaleX');
    var objectScaleY = XType.getControl('objectScaleY');
    var objectScaleZ = XType.getControl('objectScaleZ');
    var objectFov = XType.getControl('objectFov');
    var objectNear = XType.getControl('objectNear');
    var objectFar = XType.getControl('objectFar');
    var objectIntensity = XType.getControl('objectIntensity');
    var objectColor = XType.getControl('objectColor');
    var objectGroundColor = XType.getControl('objectGroundColor');
    var objectDistance = XType.getControl('objectDistance');
    var objectAngle = XType.getControl('objectAngle');
    var objectPenumbra = XType.getControl('objectPenumbra');
    var objectDecay = XType.getControl('objectDecay');
    var objectVisible = XType.getControl('objectVisible');
    var objectCastShadow = XType.getControl('objectCastShadow');
    var objectReceiveShadow = XType.getControl('objectReceiveShadow');
    var objectShadowRadius = XType.getControl('objectShadowRadius');
    var objectVisible = XType.getControl('objectVisible');
    var objectUserData = XType.getControl('objectUserData');

    objectType.setValue(object.type);

    objectUUID.setValue(object.uuid);
    objectName.setValue(object.name);

    objectPositionX.setValue(object.position.x);
    objectPositionY.setValue(object.position.y);
    objectPositionZ.setValue(object.position.z);

    objectRotationX.setValue(object.rotation.x * THREE.Math.RAD2DEG);
    objectRotationY.setValue(object.rotation.y * THREE.Math.RAD2DEG);
    objectRotationZ.setValue(object.rotation.z * THREE.Math.RAD2DEG);

    objectScaleX.setValue(object.scale.x);
    objectScaleY.setValue(object.scale.y);
    objectScaleZ.setValue(object.scale.z);

    if (object.fov !== undefined) {
        objectFov.setValue(object.fov);
    }

    if (object.near !== undefined) {
        objectNear.setValue(object.near);
    }

    if (object.far !== undefined) {
        objectFar.setValue(object.far);
    }

    if (object.intensity !== undefined) {
        objectIntensity.setValue(object.intensity);
    }

    if (object.color !== undefined) {
        objectColor.setHexValue(object.color.getHexString());
    }

    if (object.groundColor !== undefined) {
        objectGroundColor.setHexValue(object.groundColor.getHexString());
    }

    if (object.distance !== undefined) {
        objectDistance.setValue(object.distance);
    }

    if (object.angle !== undefined) {
        objectAngle.setValue(object.angle);
    }

    if (object.penumbra !== undefined) {
        objectPenumbra.setValue(object.penumbra);
    }

    if (object.decay !== undefined) {
        objectDecay.setValue(object.decay);
    }

    if (object.castShadow !== undefined) {
        objectCastShadow.setValue(object.castShadow);
    }

    if (object.receiveShadow !== undefined) {
        objectReceiveShadow.setValue(object.receiveShadow);
    }

    if (object.shadow !== undefined) {
        objectShadowRadius.setValue(object.shadow.radius);
    }

    objectVisible.setValue(object.visible);

    try {
        objectUserData.setValue(JSON.stringify(object.userData, null, '  '));
    } catch (error) {
        console.log(error);
    }

    objectUserData.dom.style.borderColor = 'transparent';
    objectUserData.dom.style.backgroundColor = '';

    this.updateTransformRows(object);
};

export default ObjectPanelEvent;