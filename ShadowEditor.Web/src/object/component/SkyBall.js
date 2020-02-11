import SkyBallVertex from './shader/sky_ball_vertex.glsl';
import SkyBallFragment from './shader/sky_ball_fragment.glsl';

/**
 * 天空球
 */
class SkyBall extends THREE.Mesh {
    constructor(url) {
        const geometry = new THREE.SphereBufferGeometry(10000, 64, 64);
        const material = new THREE.ShaderMaterial({
            vertexShader: SkyBallVertex,
            fragmentShader: SkyBallFragment,
            side: THREE.BackSide,
            uniforms: {
                diffuse: {
                    value: new THREE.TextureLoader().load(url)
                }
            }
        });
        super(geometry, material);
    }
}

export default SkyBall;