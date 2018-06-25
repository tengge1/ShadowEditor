import BaseEvent from '../BaseEvent';

/**
 * 雾效改变事件
 * @param {*} app 
 */
function SceneFogChangedEvent(app) {
    BaseEvent.call(this, app);
    this.currentFogType = null;
}

SceneFogChangedEvent.prototype = Object.create(BaseEvent.prototype);
SceneFogChangedEvent.prototype.constructor = SceneFogChangedEvent;

SceneFogChangedEvent.prototype.start = function () {
    var _this = this;
    this.app.on('sceneFogChanged.' + this.id, function (fogType, fogColor, fogNear, fogFar, fogDensity) {
        _this.onSceneFogChanged(fogType, fogColor, fogNear, fogFar, fogDensity);
    });
};

SceneFogChangedEvent.prototype.stop = function () {
    this.app.on('sceneFogChanged.' + this.id, null);
};

SceneFogChangedEvent.prototype.onSceneFogChanged = function (fogType, fogColor, fogNear, fogFar, fogDensity) {
    var scene = this.app.editor.scene;

    if (this.currentFogType !== fogType) {
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

        this.currentFogType = fogType;
    }

    if (scene.fog instanceof THREE.Fog) {
        scene.fog.color.setHex(fogColor);
        scene.fog.near = fogNear;
        scene.fog.far = fogFar;
    } else if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.setHex(fogColor);
        scene.fog.density = fogDensity;
    }

    this.app.call('render');
};

export default SceneFogChangedEvent;