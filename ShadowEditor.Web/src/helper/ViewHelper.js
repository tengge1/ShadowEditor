import BaseHelper from './BaseHelper';
import ViewVertex from './shader/view_vertex.glsl';
import ViewFragment from './shader/view_fragment.glsl';

/**
 * 视角帮助器
 * @param {*} camera
 * @param {*} domElement 
 */
function ViewHelper(camera, domElement) {
    BaseHelper.call(this, camera);

    var geometry = new THREE.ConeBufferGeometry(0.2, 1, 16, 16);
    var material = new THREE.ShaderMaterial({
        uniforms: {
            domWidth: {
                type: 'f',
                value: domElement.clientWidth, // 1432
            },
            domHeight: {
                type: 'f',
                value: domElement.clientHeight, // 665
            },
            width: {
                type: 'f',
                value: 128,
            },
            height: {
                type: 'f',
                value: 128,
            }
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