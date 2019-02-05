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

    this.domWidth = domElement.clientWidth;
    this.domHeight = domElement.clientHeight;

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
        domWidth: {
            type: 'f',
            value: this.domWidth
        },
        domHeight: {
            type: 'f',
            value: this.domHeight
        },
        right: {
            type: 'f',
            value: 280,
        },
        top: {
            type: 'f',
            value: 280,
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

    var material4 = material1.clone();
    material4.uniforms.color.value = new THREE.Vector3(0.5, 0.5, 0.5);

    var mesh = new THREE.Mesh(geometry, [
        material1,
        material4,
        material2,
        material4,
        material3,
        material4
    ]);

    return mesh;
};

export default ViewHelper;