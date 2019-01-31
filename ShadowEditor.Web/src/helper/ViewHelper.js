import BaseHelper from './BaseHelper';
import ViewVertex from './shader/view_vertex.glsl';
import ViewFragment from './shader/view_fragment.glsl';

/**
 * 视角帮助器
 * @param {*} camera 相机
 */
function ViewHelper(camera) {
    BaseHelper.call(this, camera);

    var geometry = new THREE.ConeBufferGeometry(0.2, 1, 16, 16);
    var material = new THREE.ShaderMaterial({
        uniforms: {

        },
        vertexShader: ViewVertex,
        fragmentShader: ViewFragment,
    });

    var mesh = new THREE.Mesh(geometry, material);

    this.add(mesh);
}

ViewHelper.prototype = Object.create(BaseHelper.prototype);
ViewHelper.prototype.constructor = ViewHelper;

ViewHelper.prototype.update = function () {

};

export default ViewHelper;