import BaseEvent from './BaseEvent';
import OrthographicCameraControls from '../controls/OrthographicCameraControls';

/**
 * 视图事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ViewEvent(app) {
    BaseEvent.call(this, app);

    this.changeView = this.changeView.bind(this);
}

ViewEvent.prototype = Object.create(BaseEvent.prototype);
ViewEvent.prototype.constructor = ViewEvent;

ViewEvent.prototype.start = function () {
    app.on(`changeView.${this.id}`, this.changeView);
};

ViewEvent.prototype.stop = function () {
    app.on(`changeView.${this.id}`, null);
};

ViewEvent.prototype.changeView = function (view) {
    if (view === app.editor.view) {
        return;
    }

    app.editor.view = view;

    if (this.controls === undefined) {
        this.controls = new OrthographicCameraControls(app.editor.orthCamera, app.editor.renderer.domElement);
    }

    if (view === 'perspective') {
        app.editor.controls.enabled = true;
        this.controls.disable();
        app.call(`viewChanged`, this, view);
        return;
    }

    let camera = app.editor.orthCamera;

    // TODO: 根据场景大小确定初始位置

    switch (view) {
        case 'front':
            camera.position.set(100, 0, 0);
            camera.lookAt(new THREE.Vector3());
            break;
        case 'side':
            camera.position.set(0, 0, 100);
            camera.lookAt(new THREE.Vector3());
            break;
        case 'top':
            camera.position.set(0, 100, 0);
            camera.lookAt(new THREE.Vector3());
            break;
    }

    app.editor.select(null);

    app.editor.controls.enabled = false;
    this.controls.enable();
    app.call(`viewChanged`, this, view);
};

export default ViewEvent;