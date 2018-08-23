import BaseParticle from './BaseParticle';
import vertexShader from './shader/smoke_vertex.glsl';
import fragmentShader from './shader/smoke_fragment.glsl';

/**
 * 烟
 * @author yomotsu / http://yomotsu.net
 * ported from http://webgl-fire.appspot.com/html/fire.html
 *
 * https://www.youtube.com/watch?v=jKRHmQmduDI
 * https://graphics.ethz.ch/teaching/former/imagesynthesis_06/miniprojects/p3/
 * https://www.iusb.edu/math-compsci/_prior-thesis/YVanzine_thesis.pdf
 * @param {*} options 
 */
function Smoke(camera, renderer, options) {
    BaseParticle.call(this, camera, renderer, options);

    var smoke,
        NUM_OF_PARTICLE = 32,
        texture,
        uniforms,
        material,
        geometry = new THREE.BufferGeometry(),
        position = new Float32Array(NUM_OF_PARTICLE * 3),
        shift = new Float32Array(NUM_OF_PARTICLE),
        i;

    var textureLoader = new THREE.TextureLoader();

    texture = textureLoader.load('assets/textures/VolumetricFire/smoke.png');
    uniforms = {
        time: { type: 'f', value: 0 },
        size: { type: 'f', value: 3 },
        texture: { type: 't', value: texture },
        lifetime: { type: 'f', value: 10 },
        projection: { type: 'f', value: Math.abs(this.renderer.domElement.height / (2 * Math.tan(THREE.Math.degToRad(this.camera.fov)))) }
    };
    material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });

    for (i = 0; i < NUM_OF_PARTICLE; i++) {
        position[i * 3 + 0] = THREE.Math.randFloat(-0.5, 0.5);
        position[i * 3 + 1] = 2.4;
        position[i * 3 + 3] = THREE.Math.randFloat(-0.5, 0.5);
        shift[i] = Math.random() * 1;
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));
    geometry.addAttribute('shift', new THREE.BufferAttribute(shift, 1));

    smoke = new THREE.Points(geometry, material);
    smoke.sortParticles = true;

    this.mesh = smoke;
}

Smoke.prototype = Object.create(BaseParticle.prototype);
Smoke.prototype.constructor = Smoke;

Smoke.prototype.update = function (elapsed) {
    this.mesh.material.uniforms.time.value = elapsed;
};

export default Smoke;