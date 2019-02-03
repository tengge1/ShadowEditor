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
            value: domElement.clientWidth, // 1432
        },
        domHeight: {
            type: 'f',
            value: domElement.clientHeight, // 665
        },
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
            value: new THREE.Vector3(0.8, 0.8, 0.8)
        },
        lightPosition: {
            type: 'v3',
            value: new THREE.Vector3(0, 0, 10)
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
        vertexShader: ViewVertex,
        fragmentShader: ViewFragment,
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

    this.add(mesh);
}

ViewHelper.prototype = Object.create(BaseHelper.prototype);
ViewHelper.prototype.constructor = ViewHelper;

ViewHelper.prototype.update = function () {

};

export default ViewHelper;