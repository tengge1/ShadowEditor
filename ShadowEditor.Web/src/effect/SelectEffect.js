import BaseEffect from './BaseEffect';
import SelectVertexShader from './shader/select_vertex.glsl';
import SelectFragmentShader from './shader/select_fragment.glsl';

/**
 * 选中特效
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function SelectEffect(app) {
    BaseEffect.call(this, app);
    this.scene = new THREE.Scene();
};

SelectEffect.prototype = Object.create(BaseEffect.prototype);
SelectEffect.prototype.constructor = SelectEffect;

SelectEffect.prototype.render = function (obj) {
    var renderer = this.app.editor.renderer;
    var scene = this.scene;
    var camera = this.app.editor.camera;

    var geometry = obj.geometry;
    var material = new THREE.RawShaderMaterial({
        uniforms: {
            time: {
                value: 1.0
            }
        },
        vertexShader: SelectVertexShader,
        fragmentShader: SelectFragmentShader
    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.children.length = 0;
    scene.add(mesh);

    renderer.render(scene, camera);
};

export default SelectEffect;