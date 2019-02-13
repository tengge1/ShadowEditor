import BaseHelper from './BaseHelper';
import ArrowVertex from './view/ArrowVertex.glsl';
import ArrowFragment from './view/ArrowFragment.glsl';

/**
 * 视角帮助器
 * @param {*} app 
 */
function ViewHelper(app) {
    BaseHelper.call(this, app);
}

ViewHelper.prototype = Object.create(BaseHelper.prototype);
ViewHelper.prototype.constructor = ViewHelper;

ViewHelper.prototype.start = function () {
    this.mesh = this.createMesh();
    this.app.editor.sceneHelpers.add(this.mesh);
};

ViewHelper.prototype.stop = function () {
    this.app.editor.sceneHelpers.remove(this.mesh);
    delete this.mesh;
};

ViewHelper.prototype.createMesh = function () {
    var geometry = new THREE.ConeBufferGeometry(0.25, 1.0, 16, 16);
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

    var domElement = this.app.editor.renderer.domElement;

    var uniforms = {
        domWidth: {
            type: 'f',
            value: domElement.clientWidth
        },
        domHeight: {
            type: 'f',
            value: domElement.clientHeight
        },
        size: {
            type: 'f',
            value: 80 / 878 * domElement.clientWidth
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
        fragmentShader: ArrowFragment
    });

    var material2 = material1.clone();
    material2.uniforms.color.value = new THREE.Vector3(0.0, 1.0, 0.0);

    var material3 = material1.clone();
    material3.uniforms.color.value = new THREE.Vector3(0.0, 0.0, 1.0);

    var material4 = material1.clone();
    material4.uniforms.color.value = new THREE.Vector3(0.5, 0.5, 0.5);

    return new THREE.Mesh(geometry, [
        material1,
        material4,
        material2,
        material4,
        material3,
        material4
    ]);
};

ViewHelper.prototype.raycast = function (raycaster, intersects) {
    // TODO: ViewHelper select test method
    // var object = raycaster.intersectObject(this.mesh);

    // if (object) {
    //     intersects.push(object);
    // }
};

export default ViewHelper;