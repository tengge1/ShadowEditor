import ViewportInfo from './ViewportInfo';
import SetPositionCommand from '../command/SetPositionCommand';
import SetRotationCommand from '../command/SetRotationCommand';
import SetScaleCommand from '../command/SetScaleCommand';
import UI2 from '../ui2/UI';

/**
 * 场景编辑区
 * @author mrdoob / http://mrdoob.com/
 */
function Viewport(app) {
    this.app = app;
    var editor = this.app.editor;

    var container = new UI2.Div({
        parent: this.app.container,
        id: 'viewport',
        style: 'position: absolute'
    });

    container.render();

    this.viewportInfo = new ViewportInfo(app, container);

    //
    var _this = this;

    var renderer = null;

    var camera = editor.camera;
    var scene = editor.scene;
    var sceneHelpers = editor.sceneHelpers;

    var objects = [];

    //

    var vrEffect, vrControls, vrCamera;

    // helpers

    var grid = new THREE.GridHelper(60, 60);
    sceneHelpers.add(grid);

    //

    var box = new THREE.Box3();

    var selectionBox = new THREE.BoxHelper();
    selectionBox.material.depthTest = false;
    selectionBox.material.transparent = true;
    selectionBox.visible = false;
    sceneHelpers.add(selectionBox);

    var objectPositionOnDown = null;
    var objectRotationOnDown = null;
    var objectScaleOnDown = null;

    var transformControls = new THREE.TransformControls(camera, container.dom);
    transformControls.addEventListener('change', function () {

        var object = transformControls.object;

        if (object !== undefined) {

            selectionBox.setFromObject(object);

            if (editor.helpers[object.id] !== undefined) {

                editor.helpers[object.id].update();

            }

            _this.app.call('refreshSidebarObject3D', _this, object);
        }

        _this.app.call('render');

    });
    transformControls.addEventListener('mouseDown', function () {

        var object = transformControls.object;

        objectPositionOnDown = object.position.clone();
        objectRotationOnDown = object.rotation.clone();
        objectScaleOnDown = object.scale.clone();

        controls.enabled = false;

    });
    transformControls.addEventListener('mouseUp', function () {

        var object = transformControls.object;

        if (object !== undefined) {

            switch (transformControls.getMode()) {

                case 'translate':

                    if (!objectPositionOnDown.equals(object.position)) {

                        editor.execute(new SetPositionCommand(object, object.position, objectPositionOnDown));

                    }

                    break;

                case 'rotate':

                    if (!objectRotationOnDown.equals(object.rotation)) {

                        editor.execute(new SetRotationCommand(object, object.rotation, objectRotationOnDown));

                    }

                    break;

                case 'scale':

                    if (!objectScaleOnDown.equals(object.scale)) {

                        editor.execute(new SetScaleCommand(object, object.scale, objectScaleOnDown));

                    }

                    break;

            }

        }

        controls.enabled = true;

    });

    sceneHelpers.add(transformControls);

    // object picking

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    // events

    function getIntersects(point, objects) {

        mouse.set((point.x * 2) - 1, -(point.y * 2) + 1);

        raycaster.setFromCamera(mouse, camera);

        return raycaster.intersectObjects(objects);

    }

    var onDownPosition = new THREE.Vector2();
    var onUpPosition = new THREE.Vector2();
    var onDoubleClickPosition = new THREE.Vector2();

    function getMousePosition(dom, x, y) {

        var rect = dom.getBoundingClientRect();
        return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];

    }

    function handleClick() {

        if (onDownPosition.distanceTo(onUpPosition) === 0) {

            var intersects = getIntersects(onUpPosition, objects);

            if (intersects.length > 0) {

                var object = intersects[0].object;

                if (object.userData.object !== undefined) {

                    // helper

                    editor.select(object.userData.object);

                } else {

                    editor.select(object);

                }

            } else {

                editor.select(null);

            }

            _this.app.call('render');

        }

    }

    function onMouseDown(event) {

        event.preventDefault();

        var array = getMousePosition(container.dom, event.clientX, event.clientY);
        onDownPosition.fromArray(array);

        document.addEventListener('mouseup', onMouseUp, false);

    }

    function onMouseUp(event) {

        var array = getMousePosition(container.dom, event.clientX, event.clientY);
        onUpPosition.fromArray(array);

        handleClick();

        document.removeEventListener('mouseup', onMouseUp, false);

    }

    function onTouchStart(event) {

        var touch = event.changedTouches[0];

        var array = getMousePosition(container.dom, touch.clientX, touch.clientY);
        onDownPosition.fromArray(array);

        document.addEventListener('touchend', onTouchEnd, false);

    }

    function onTouchEnd(event) {

        var touch = event.changedTouches[0];

        var array = getMousePosition(container.dom, touch.clientX, touch.clientY);
        onUpPosition.fromArray(array);

        handleClick();

        document.removeEventListener('touchend', onTouchEnd, false);

    }

    function onDoubleClick(event) {

        var array = getMousePosition(container.dom, event.clientX, event.clientY);
        onDoubleClickPosition.fromArray(array);

        var intersects = getIntersects(onDoubleClickPosition, objects);

        if (intersects.length > 0) {

            var intersect = intersects[0];

            _this.app.call('objectFocused', _this, intersect.object);

        }

    }

    container.dom.addEventListener('mousedown', onMouseDown, false);
    container.dom.addEventListener('touchstart', onTouchStart, false);
    container.dom.addEventListener('dblclick', onDoubleClick, false);

    // controls need to be added *after* main logic,
    // otherwise controls.enabled doesn't work.

    var controls = new THREE.EditorControls(camera, container.dom);
    controls.addEventListener('change', function () {
        transformControls.update();
        _this.app.call('cameraChanged', _this, camera);
    });

    this.app.on('editorCleared.Viewport', function () {
        controls.center.set(0, 0, 0);
        _this.app.call('render');
    });

    this.app.on('enterVR.Viewport', function () {
        vrEffect.isPresenting ? vrEffect.exitPresent() : vrEffect.requestPresent();
    });

    this.app.on('themeChanged.Viewport', function (value) {
        switch (value) {
            case 'assets/css/light.css':
                sceneHelpers.remove(grid);
                grid = new THREE.GridHelper(60, 60, 0x444444, 0x888888);
                sceneHelpers.add(grid);
                break;
            case 'assets/css/dark.css':
                sceneHelpers.remove(grid);
                grid = new THREE.GridHelper(60, 60, 0xbbbbbb, 0x888888);
                sceneHelpers.add(grid);
                break;
        }

        _this.app.call('render');
    });

    this.app.on('transformModeChanged.Viewport', function (mode) {
        transformControls.setMode(mode);
    });

    this.app.on('snapChanged.Viewport', function (dist) {
        transformControls.setTranslationSnap(dist);
    });

    this.app.on('spaceChanged.Viewport', function (space) {
        transformControls.setSpace(space);
    });

    this.app.on('rendererChanged.Viewport', function (newRenderer) {
        if (renderer !== null) {
            container.dom.removeChild(renderer.domElement);
        }

        renderer = newRenderer;
        _this.app.editor.renderer = renderer;

        renderer.autoClear = false;
        renderer.autoUpdateScene = false;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.dom.offsetWidth, container.dom.offsetHeight);

        container.dom.appendChild(renderer.domElement);

        if (renderer.vr && renderer.vr.enabled) {
            vrControls = new THREE.VRControls(vrCamera);
            vrEffect = new THREE.VREffect(renderer);

            window.addEventListener('vrdisplaypresentchange', function (event) {
                effect.isPresenting ? _this.app.call('enteredVR', _this) : _this.app.call('exitedVR', _this);
            }, false);
        }

        _this.app.call('render');
    });

    this.app.on('sceneGraphChanged.Viewport', function () {
        _this.app.call('render');
    });

    this.app.on('cameraChanged.Viewport', function () {
        _this.app.call('render');
    });

    this.app.on('objectSelected.Viewport', function (object) {

        selectionBox.visible = false;
        transformControls.detach();

        if (object !== null && object !== scene) {

            box.setFromObject(object);

            if (box.isEmpty() === false) {

                selectionBox.setFromObject(object);
                selectionBox.visible = true;

            }

            transformControls.attach(object);

        }

        _this.app.call('render');

    });

    this.app.on('objectFocused.Viewport', function (object) {
        controls.focus(object);
    });

    this.app.on('geometryChanged.Viewport', function (object) {
        if (object !== undefined) {
            selectionBox.setFromObject(object);
        }

        _this.app.call('render');
    });

    this.app.on('objectAdded.Viewport', function (object) {
        object.traverse(function (child) {
            objects.push(child);
        });
    });

    this.app.on('objectChanged.Viewport', function (object) {

        if (editor.selected === object) {

            selectionBox.setFromObject(object);
            transformControls.update();

        }

        if (object instanceof THREE.PerspectiveCamera) {

            object.updateProjectionMatrix();

        }

        if (editor.helpers[object.id] !== undefined) {

            editor.helpers[object.id].update();

        }

        _this.app.call('render');

    });

    this.app.on('objectRemoved.Viewport', function (object) {
        object.traverse(function (child) {
            objects.splice(objects.indexOf(child), 1);
        });
    });

    this.app.on('helperAdded.Viewport', function (object) {
        objects.push(object.getObjectByName('picker'));
    });

    this.app.on('helperRemoved.Viewport', function (object) {
        objects.splice(objects.indexOf(object.getObjectByName('picker')), 1);
    });

    this.app.on('materialChanged.Viewport', function (material) {
        _this.app.call('render');
    });

    // fog

    this.app.on('sceneBackgroundChanged.Viewport', function (backgroundColor) {
        scene.background.setHex(backgroundColor);
        _this.app.call('render');
    });

    var currentFogType = null;

    this.app.on('sceneFogChanged.Viewport', function (fogType, fogColor, fogNear, fogFar, fogDensity) {

        if (currentFogType !== fogType) {

            switch (fogType) {

                case 'None':
                    scene.fog = null;
                    break;
                case 'Fog':
                    scene.fog = new THREE.Fog();
                    break;
                case 'FogExp2':
                    scene.fog = new THREE.FogExp2();
                    break;

            }

            currentFogType = fogType;

        }

        if (scene.fog instanceof THREE.Fog) {

            scene.fog.color.setHex(fogColor);
            scene.fog.near = fogNear;
            scene.fog.far = fogFar;

        } else if (scene.fog instanceof THREE.FogExp2) {

            scene.fog.color.setHex(fogColor);
            scene.fog.density = fogDensity;

        }

        _this.app.call('render');

    });

    //

    this.app.on('windowResize.Viewport', function () {
        // TODO: Move this out?

        editor.DEFAULT_CAMERA.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
        editor.DEFAULT_CAMERA.updateProjectionMatrix();

        camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.dom.offsetWidth, container.dom.offsetHeight);

        _this.app.call('render');
    });

    this.app.on('showGridChanged.Viewport', function (showGrid) {
        grid.visible = showGrid;
        _this.app.call('render');
    });

    //

    function animate() {

        requestAnimationFrame(animate);

        /*

		// animations

		if ( THREE.AnimationHandler.animations.length > 0 ) {

			THREE.AnimationHandler.update( 0.016 );

			for ( var i = 0, l = sceneHelpers.children.length; i < l; i ++ ) {

				var helper = sceneHelpers.children[ i ];

				if ( helper instanceof THREE.SkeletonHelper ) {

					helper.update();

				}

			}

		}
		*/

        if (vrEffect && vrEffect.isPresenting) {

            _this.app.call('render');

        }

    }

    function render() {
        sceneHelpers.updateMatrixWorld();
        scene.updateMatrixWorld();

        if (vrEffect && vrEffect.isPresenting) {
            vrControls.update();

            camera.updateMatrixWorld();

            vrEffect.render(scene, vrCamera);
            vrEffect.render(sceneHelpers, vrCamera);
        } else {
            renderer.render(scene, camera);

            if (renderer instanceof THREE.RaytracingRenderer === false) {
                renderer.render(sceneHelpers, camera);
            }
        }
    }

    this.app.on('render.Viewport', function () {
        render();
    });

    requestAnimationFrame(animate);
};

export default Viewport;