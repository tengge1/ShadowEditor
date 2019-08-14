import BaseEvent from './BaseEvent';
import EffectRenderer from '../render/EffectRenderer';

/**
 * 视图事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ViewEvent(app) {
    BaseEvent.call(this, app);

    this.changeView = this.changeView.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
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

    if (view === 'perspective') {
        app.on(`mousewheel.${this.id}`, null);
        app.call(`viewChanged`, this, view);
        return;
    }

    let camera = app.editor.orthCamera;

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

    app.on(`mousewheel.${this.id}`, this.onMouseWheel);
    app.call(`viewChanged`, this, view);
};

ViewEvent.prototype.onMouseWheel = function (event) {
    const delta = event.wheelDelta / 10;

    let camera = app.editor.orthCamera;

    // switch (app.editor.view) {
    //     case 'front':
    //         camera.position.x += delta;
    //         break;
    //     case 'side':
    //         camera.position.z += delta;
    //         break;
    //     case 'top':
    //         camera.position.y += delta;
    //         break;
    // }
};

export default ViewEvent;