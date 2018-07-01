import SetPositionCommand from '../command/SetPositionCommand';
import SetRotationCommand from '../command/SetRotationCommand';
import SetScaleCommand from '../command/SetScaleCommand';
import SetUuidCommand from '../command/SetUuidCommand';
import SetValueCommand from '../command/SetValueCommand';
import SetColorCommand from '../command/SetColorCommand';
import UI from '../ui/UI';

/**
 * 物体面板
 * @author mrdoob / http://mrdoob.com/
 */
function ObjectPanel(app) {
    this.app = app;
    var editor = this.app.editor;

    var container = new UI.Div({
        style: 'border-top: 0; padding-top: 20px; display: none;'
    });

    // Actions

    var objectActions = new UI.Select({
        options: {
            'Actions': '动作',
            'Reset Position': '重置位置',
            'Reset Rotation': '重置旋转',
            'Reset Scale': '重置缩放'
        },
        style: 'position: absolute; right: 8px; font-size: 11px;',
        onClick: function (event) {
            event.stopPropagation(); // Avoid panel collapsing
        },
        onChange: function (event) {
            var object = editor.selected;

            switch (this.getValue()) {
                case '重置位置':
                    editor.execute(new SetPositionCommand(object, new THREE.Vector3(0, 0, 0)));
                    break;
                case '重置旋转':
                    editor.execute(new SetRotationCommand(object, new THREE.Euler(0, 0, 0)));
                    break;
                case '重置缩放':
                    editor.execute(new SetScaleCommand(object, new THREE.Vector3(1, 1, 1)));
                    break;
            }

            this.setValue('动作');
        }
    });

    // type

    var objectTypeRow = new UI.Row();
    var objectType = new UI.Text();

    objectTypeRow.add(new UI.Text({
        text: '类型',
        style: 'width: 90px;'
    }));

    objectTypeRow.add(objectType);

    container.add(objectTypeRow);

    // uuid

    var objectUUIDRow = new UI.Row();
    var objectUUID = new UI.Input({
        style: 'width: 102px; font-size: 12px;',
        disabled: true
    });

    var objectUUIDRenew = new UI.Button({
        text: '新建',
        style: 'margin-left: 7px;',
        onClick: function () {
            objectUUID.setValue(THREE.Math.generateUUID());
            editor.execute(new SetUuidCommand(editor.selected, objectUUID.getValue()));
        }
    });

    objectUUIDRow.add(new UI.Text({
        text: 'UUID',
        style: 'width: 90px;'
    }));

    objectUUIDRow.add(objectUUID);
    objectUUIDRow.add(objectUUIDRenew);

    container.add(objectUUIDRow);

    // name

    var objectNameRow = new UI.Row();

    var objectName = new UI.Input({
        style: 'width: 150px; font-size: 12px;',
        onChange: function () {
            editor.execute(new SetValueCommand(editor.selected, 'name', objectName.getValue()));
        }
    });

    objectNameRow.add(new UI.Text({
        text: '名称',
        style: 'width: 90px;'
    }));

    objectNameRow.add(objectName);

    container.add(objectNameRow);

    // position

    var objectPositionRow = new UI.Row();

    var objectPositionX = new UI.Number({
        style: 'width: 50px;',
        onChange: update
    });

    var objectPositionY = new UI.Number({
        style: 'width: 50px;',
        onChange: update
    });

    var objectPositionZ = new UI.Number({
        style: 'width: 50px;',
        onChange: update
    });

    objectPositionRow.add(new UI.Text({
        text: '位置',
        style: 'width: 90px;'
    }));

    objectPositionRow.add(objectPositionX);
    objectPositionRow.add(objectPositionY);
    objectPositionRow.add(objectPositionZ);

    container.add(objectPositionRow);

    // rotation

    var objectRotationRow = new UI.Row();

    var objectRotationX = new UI.Number({
        step: 10,
        unit: '°',
        style: 'width: 50px;',
        onChange: update
    });

    var objectRotationY = new UI.Number({
        step: 10,
        unit: '°',
        style: 'width: 50px;',
        onChange: update
    });

    var objectRotationZ = new UI.Number({
        step: 10,
        unit: '°',
        style: 'width: 50px;',
        onChange: update
    });

    objectRotationRow.add(new UI.Text({
        text: '旋转',
        style: 'width: 90px;'
    }));

    objectRotationRow.add(objectRotationX);
    objectRotationRow.add(objectRotationY);
    objectRotationRow.add(objectRotationZ);

    container.add(objectRotationRow);

    // scale

    var objectScaleRow = new UI.Row();

    var objectScaleLock = new UI.Checkbox({
        value: true,
        style: 'position: absolute; left: 75px;'
    });

    var objectScaleX = new UI.Number({
        value: 1,
        range: [0.01, Infinity],
        style: 'width: 50px;',
        onChange: updateScaleX
    });

    var objectScaleY = new UI.Number({
        value: 1,
        range: [0.01, Infinity],
        style: 'width: 50px;',
        onChange: updateScaleY
    });

    var objectScaleZ = new UI.Number({
        value: 1,
        range: [0.01, Infinity],
        style: 'width: 50px;',
        onChange: updateScaleZ
    });

    objectScaleRow.add(new UI.Text({
        text: '尺寸',
        style: 'width: 90px;'
    }));

    objectScaleRow.add(objectScaleLock);
    objectScaleRow.add(objectScaleX);
    objectScaleRow.add(objectScaleY);
    objectScaleRow.add(objectScaleZ);

    container.add(objectScaleRow);

    // fov

    var objectFovRow = new UI.Row();
    var objectFov = new UI.Number({
        onChange: update
    });

    objectFovRow.add(new UI.Text({
        text: '视场',
        style: 'width: 90px;'
    }));

    objectFovRow.add(objectFov);

    container.add(objectFovRow);

    // near

    var objectNearRow = new UI.Row();
    var objectNear = new UI.Number({
        onChange: update
    });

    objectNearRow.add(new UI.Text({
        text: '近点',
        style: 'width: 90px;'
    }));

    objectNearRow.add(objectNear);

    container.add(objectNearRow);

    // far

    var objectFarRow = new UI.Row();
    var objectFar = new UI.Number({
        onChange: update
    });

    objectFarRow.add(new UI.Text({
        text: '远点',
        style: 'width: 90px;'
    }));

    objectFarRow.add(objectFar);

    container.add(objectFarRow);

    // intensity

    var objectIntensityRow = new UI.Row();
    var objectIntensity = new UI.Number({
        range: [0, Infinity],
        onChange: update
    });

    objectIntensityRow.add(new UI.Text({
        text: '强度',
        style: 'width: 90px;'
    }));

    objectIntensityRow.add(objectIntensity);

    container.add(objectIntensityRow);

    // color

    var objectColorRow = new UI.Row();

    var objectColor = new UI.Color({
        onChange: update
    });

    objectColorRow.add(new UI.Text({
        text: '颜色',
        style: 'width: 90px;'
    }));

    objectColorRow.add(objectColor);

    container.add(objectColorRow);

    // ground color

    var objectGroundColorRow = new UI.Row();
    var objectGroundColor = new UI.Color({
        onChange: update
    });

    objectGroundColorRow.add(new UI.Text({
        text: '地面颜色',
        style: 'width: 90px;'
    }));

    objectGroundColorRow.add(objectGroundColor);

    container.add(objectGroundColorRow);

    // distance

    var objectDistanceRow = new UI.Row();

    var objectDistance = new UI.Number({
        range: [0, Infinity],
        onChange: update
    });

    objectDistanceRow.add(new UI.Text({
        text: '距离',
        style: 'width: 90px;'
    }));

    objectDistanceRow.add(objectDistance);

    container.add(objectDistanceRow);

    // angle

    var objectAngleRow = new UI.Row();

    var objectAngle = new UI.Number({
        precision: 3,
        range: [0, Math.PI / 2],
        onChange: update
    });

    objectAngleRow.add(new UI.Text({
        text: '角度',
        style: 'width: 90px;'
    }));

    objectAngleRow.add(objectAngle);

    container.add(objectAngleRow);

    // penumbra

    var objectPenumbraRow = new UI.Row();
    var objectPenumbra = new UI.Number({
        range: [0, 1],
        onChange: update
    });

    objectPenumbraRow.add(new UI.Text({
        text: '边缘',
        style: 'width: 90px;'
    }));

    objectPenumbraRow.add(objectPenumbra);

    container.add(objectPenumbraRow);

    // decay

    var objectDecayRow = new UI.Row();

    var objectDecay = new UI.Number({
        range: [0, Infinity],
        onChange: update
    });

    objectDecayRow.add(new UI.Text({
        text: '衰变',
        style: 'width: 90px;'
    }));
    objectDecayRow.add(objectDecay);

    container.add(objectDecayRow);

    // shadow

    var objectShadowRow = new UI.Row();

    objectShadowRow.add(new UI.Text({
        text: '阴影',
        style: 'width: 90px;'
    }));

    var objectCastShadow = new UI.Boolean({
        value: false,
        text: '产生',
        update: update
    });

    objectShadowRow.add(objectCastShadow);

    var objectReceiveShadow = new UI.Boolean({
        value: false,
        text: '接收',
        onChange: update
    });

    objectShadowRow.add(objectReceiveShadow);

    var objectShadowRadius = new UI.Number({
        value: 1,
        onChange: update
    });

    objectShadowRow.add(objectShadowRadius);

    container.add(objectShadowRow);

    // visible

    var objectVisibleRow = new UI.Row();

    var objectVisible = new UI.Checkbox({
        onChange: update
    });

    objectVisibleRow.add(new UI.Text({
        text: '可见性',
        style: 'width: 90px;'
    }));

    objectVisibleRow.add(objectVisible);

    container.add(objectVisibleRow);

    // user data

    var timeout;

    var objectUserDataRow = new UI.Row();

    var objectUserData = new UI.TextArea({
        style: 'width: 150px; height: 40px; font-size: 12px;',
        onChange: update,
        onKeyUp: function () {
            try {

                JSON.parse(objectUserData.getValue());

                objectUserData.dom.classList.add('success');
                objectUserData.dom.classList.remove('fail');

            } catch (error) {

                objectUserData.dom.classList.remove('success');
                objectUserData.dom.classList.add('fail');

            }

        }
    });

    objectUserDataRow.add(new UI.Text({
        text: '用户数据',
        style: 'width: 90px'
    }));

    objectUserDataRow.add(objectUserData);

    container.add(objectUserDataRow);

    container.render();

    //

    function updateScaleX() {

        var object = editor.selected;

        if (objectScaleLock.getValue() === true) {

            var scale = objectScaleX.getValue() / object.scale.x;

            objectScaleY.setValue(objectScaleY.getValue() * scale);
            objectScaleZ.setValue(objectScaleZ.getValue() * scale);

        }

        update();

    }

    function updateScaleY() {

        var object = editor.selected;

        if (objectScaleLock.getValue() === true) {

            var scale = objectScaleY.getValue() / object.scale.y;

            objectScaleX.setValue(objectScaleX.getValue() * scale);
            objectScaleZ.setValue(objectScaleZ.getValue() * scale);

        }

        update();

    }

    function updateScaleZ() {

        var object = editor.selected;

        if (objectScaleLock.getValue() === true) {

            var scale = objectScaleZ.getValue() / object.scale.z;

            objectScaleX.setValue(objectScaleX.getValue() * scale);
            objectScaleY.setValue(objectScaleY.getValue() * scale);

        }

        update();

    }

    function update() {

        var object = editor.selected;

        if (object !== null) {

            var newPosition = new THREE.Vector3(objectPositionX.getValue(), objectPositionY.getValue(), objectPositionZ.getValue());
            if (object.position.distanceTo(newPosition) >= 0.01) {

                editor.execute(new SetPositionCommand(object, newPosition));

            }

            var newRotation = new THREE.Euler(objectRotationX.getValue() * THREE.Math.DEG2RAD, objectRotationY.getValue() * THREE.Math.DEG2RAD, objectRotationZ.getValue() * THREE.Math.DEG2RAD);
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

    }

    function updateRows(object) {

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

    }

    function updateTransformRows(object) {

        if (object instanceof THREE.Light ||
            (object instanceof THREE.Object3D && object.userData.targetInverse)) {

            objectRotationRow.dom.style.display = 'none';
            objectScaleRow.dom.style.display = 'none';
        } else {

            objectRotationRow.dom.style.display = '';
            objectScaleRow.dom.style.display = '';

        }

    }

    // events
    this.app.on('objectSelected.ObjectPanel', function (object) {

        if (object !== null) {
            container.dom.style.display = 'block';
            updateRows(object);
            updateUI(object);

        } else {
            container.dom.style.display = 'none';
        }
    });

    this.app.on('objectChanged.ObjectPanel', function (object) {

        if (object !== editor.selected) return;

        updateUI(object);

    });

    this.app.on('refreshSidebarObject3D.ObjectPanel', function (object) {
        if (object !== editor.selected) return;

        updateUI(object);
    });

    function updateUI(object) {

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

        updateTransformRows(object);

    }

    return container;

};

export default ObjectPanel;