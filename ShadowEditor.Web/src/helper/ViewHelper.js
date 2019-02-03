import BaseHelper from './BaseHelper';
import ArrowVertex from './view/ArrowVertex.glsl';
import ArrowFragment from './view/ArrowFragment.glsl';

/**
 * 视角帮助器
 * @param {*} camera
 * @param {*} domElement 
 */
function ViewHelper(camera, domElement) {
    BaseHelper.call(this, camera);

    this.add(this.createMesh());
}

ViewHelper.prototype = Object.create(BaseHelper.prototype);
ViewHelper.prototype.constructor = ViewHelper;

ViewHelper.prototype.update = function () {

};

ViewHelper.prototype.createMesh = function () {
    var geometry = new THREE.ConeBufferGeometry(0.1, 0.4, 16, 16);
    geometry.computeBoundingBox();
    geometry.translate(0, geometry.boundingBox.min.y, 0);

    var geometryPX = geometry.clone();
    geometryPX.rotateZ(Math.PI / 2);

    var geometryNX = geometry.clone();
    geometryNX.rotateZ(-Math.PI / 2);

    var geometryPY = geometry.clone();
    geometryPY.rotateX(Math.PI);

    var geometryNY = geometry.clone();

    var geometryPZ = geometry.clone();
    geometryPZ.rotateX(-Math.PI / 2);

    var geometryNZ = geometry.clone();
    geometryNZ.rotateX(Math.PI / 2);

    geometry = THREE.BufferGeometryUtils.mergeBufferGeometries([
        geometryPX,
        geometryNX,
        geometryPY,
        geometryNY,
        geometryPZ,
        geometryNZ
    ], true);

    var uniforms = {
        width: {
            type: 'f',
            value: 80,
        },
        height: {
            type: 'f',
            value: 80,
        },
        color: {
            type: 'v3',
            value: new THREE.Vector3(1.0, 0.0, 0.0)
        },
        ambientColor: {
            type: 'v3',
            value: new THREE.Vector3(0.4, 0.4, 0.4)
        },
        lightPosition: {
            type: 'v3',
            value: new THREE.Vector3(10, 10, 10)
        },
        diffuseColor: {
            type: 'v3',
            value: new THREE.Vector3(1.0, 1.0, 1.0)
        },
        shininess: {
            type: 'float',
            value: 30
        }
    };

    var material1 = new THREE.RawShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(uniforms),
        vertexShader: ArrowVertex,
        fragmentShader: ArrowFragment,
    });

    var material2 = material1.clone();
    material2.uniforms.color.value = new THREE.Vector3(0.0, 1.0, 0.0);

    var material3 = material1.clone();
    material3.uniforms.color.value = new THREE.Vector3(0.0, 0.0, 1.0);

    var mesh = new THREE.Mesh(geometry, [
        material1,
        material1,
        material2,
        material2,
        material3,
        material3
    ]);

    mesh.scale.multiplyScalar(0.1);

    return mesh;
};

export default ViewHelper;