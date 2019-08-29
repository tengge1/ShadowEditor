import SphereVertexShader from './shader/sphere_vertex.glsl';
import SphereFragmentShader from './shader/sphere_fragment.glsl';

/**
 * 应用程序
 */
class Application {
    constructor(canvas) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        canvas.width = width;
        canvas.height = height;

        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2);

        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(new THREE.Vector3());

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        });

        this.renderer.setSize(width, height);

        let geometry = new THREE.PlaneBufferGeometry(width, height);
        let material = new THREE.ShaderMaterial({
            vertexShader: SphereVertexShader,
            fragmentShader: SphereFragmentShader,
        });
        let mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        this.render = this.render.bind(this);
    }

    start() {
        this.render();
    }

    render() {
        requestAnimationFrame(this.render);

        this.renderer.render(this.scene, this.camera);
    }
}

export default Application;