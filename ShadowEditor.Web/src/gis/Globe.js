import GlobeGeometry from './GlobeGeometry';
import GlobeMaterial from './GlobeMaterial';

/**
 * 地球
 * @param {*} app 
 */
function Globe(app) {
    this.app = app;
}

Globe.prototype.start = function () {
    var lon = 0;
    var lat = 0;
    var zoom = 1;

    var geometry = new GlobeGeometry();
    var material = new GlobeMaterial();

    this.mesh = new THREE.Mesh(geometry, material);
    this.app.editor.sceneHelpers.add(this.mesh);

    this.app.on(`beforeRender`, this.onBeforeRender.bind(this));
};

Globe.prototype.onBeforeRender = function () {

};

export default Globe;