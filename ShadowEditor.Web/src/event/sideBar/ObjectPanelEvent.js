import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';
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
    this.tabName = '物体';
}

ObjectPanelEvent.prototype = Object.create(BaseEvent.prototype);
ObjectPanelEvent.prototype.constructor = ObjectPanelEvent;

ObjectPanelEvent.prototype.start = function () {
    this.app.on(`selectPropertyTab.${this.id}`, this.onSelectPropertyTab.bind(this));
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
    this.app.on(`selectPropertyTab.${this.id}`, null);
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
 * 选择物体选项卡
 * @param {*} tabName 
 */
ObjectPanelEvent.prototype.onSelectPropertyTab = function (tabName) {
    this.tabName = tabName;
    if (this.app.editor.selected != null && tabName === '物体') {
        UI.get('objectPanel').dom.style.display = '';
    } else {
        UI.get('objectPanel').dom.style.display = 'none';
    }
};

/**
 * 物体选中事件
 * @param {*} object 
 */
ObjectPanelEvent.prototype.onObjectSelected = function (object) {
    var container = UI.get('objectPanel');

    // 设置物体面板显示隐藏
    if (this.tabName === '物体' && object != null) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
    }

    if (object !== null) {
        this.updateRows(object);
        this.app.call('updateObjectPanel', this, object);
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
    var objectScaleLock = UI.get('objectScaleLock');
    var objectScaleX = UI.get('objectScaleX');
    var objectScaleY = UI.get('objectScaleY');
    var objectScaleZ = UI.get('objectScaleZ');

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
    var objectScaleLock = UI.get('objectScaleLock');
    var objectScaleX = UI.get('objectScaleX');
    var objectScaleY = UI.get('objectScaleY');
    var objectScaleZ = UI.get('objectScaleZ');

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
    var objectScaleLock = UI.get('objectScaleLock');
    var objectScaleX = UI.get('objectScaleX');
    var objectScaleY = UI.get('objectScaleY');
    var objectScaleZ = UI.get('objectScaleZ');

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

    var objectPositionX = UI.get('objectPositionX');
    var objectPositionY = UI.get('objectPositionY');
    var objectPositionZ = UI.get('objectPositionZ');
    var objectRotationX = UI.get('objectRotationX');
    var objectRotationY = UI.get('objectRotationY');
    var objectRotationZ = UI.get('objectRotationZ');
    var objectScaleX = UI.get('objectScaleX');
    var objectScaleY = UI.get('objectScaleY');
    var objectScaleZ = UI.get('objectScaleZ');
    var objectFov = UI.get('objectFov');
    var objectNear = UI.get('objectNear');
    var objectFar = UI.get('objectFar');
    var objectIntensity = UI.get('objectIntensity');
    var objectColor = UI.get('objectColor');
    var objectGroundColor = UI.get('objectGroundColor');
    var objectDistance = UI.get('objectDistance');
    var objectAngle = UI.get('objectAngle');
    var objectPenumbra = UI.get('objectPenumbra');
    var objectDecay = UI.get('objectDecay');
    var objectVisible = UI.get('objectVisible');
    var objectCastShadow = UI.get('objectCastShadow');
    var objectReceiveShadow = UI.get('objectReceiveShadow');
    var objectShadowRadius = UI.get('objectShadowRadius');
    var objectUserData = UI.get('objectUserData');

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
    var objectFovRow = UI.get('objectFovRow');
    var objectNearRow = UI.get('objectNearRow');
    var objectFarRow = UI.get('objectFarRow');
    var objectIntensityRow = UI.get('objectIntensityRow');
    var objectColorRow = UI.get('objectColorRow');
    var objectGroundColorRow = UI.get('objectGroundColorRow');
    var objectDistanceRow = UI.get('objectDistanceRow');
    var objectAngleRow = UI.get('objectAngleRow');
    var objectPenumbraRow = UI.get('objectPenumbraRow');
    var objectDecayRow = UI.get('objectDecayRow');
    var objectShadowRow = UI.get('objectShadowRow');
    var objectReceiveShadow = UI.get('objectReceiveShadow');
    var objectShadowRadius = UI.get('objectShadowRadius');

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
    var objectRotationRow = UI.get('objectRotationRow');
    var objectScaleRow = UI.get('objectScaleRow');

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
    var objectType = UI.get('objectType');
    var objectUUID = UI.get('objectUUID');
    var objectName = UI.get('objectName');
    var objectPositionX = UI.get('objectPositionX');
    var objectPositionY = UI.get('objectPositionY');
    var objectPositionZ = UI.get('objectPositionZ');
    var objectRotationX = UI.get('objectRotationX');
    var objectRotationY = UI.get('objectRotationY');
    var objectRotationZ = UI.get('objectRotationZ');
    var objectScaleX = UI.get('objectScaleX');
    var objectScaleY = UI.get('objectScaleY');
    var objectScaleZ = UI.get('objectScaleZ');
    var objectFov = UI.get('objectFov');
    var objectNear = UI.get('objectNear');
    var objectFar = UI.get('objectFar');
    var objectIntensity = UI.get('objectIntensity');
    var objectColor = UI.get('objectColor');
    var objectGroundColor = UI.get('objectGroundColor');
    var objectDistance = UI.get('objectDistance');
    var objectAngle = UI.get('objectAngle');
    var objectPenumbra = UI.get('objectPenumbra');
    var objectDecay = UI.get('objectDecay');
    var objectVisible = UI.get('objectVisible');
    var objectCastShadow = UI.get('objectCastShadow');
    var objectReceiveShadow = UI.get('objectReceiveShadow');
    var objectShadowRadius = UI.get('objectShadowRadius');
    var objectVisible = UI.get('objectVisible');
    var objectUserData = UI.get('objectUserData');

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