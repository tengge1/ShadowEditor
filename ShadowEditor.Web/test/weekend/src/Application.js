import SphereVertexShader from './shader/sphere_vertex.glsl';
import SphereFragmentShader from './shader/sphere_fragment.glsl';

/**
 * 应用程序
 */
class Application {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = 200;
        this.height = 100;

        canvas.style.width = `${this.width}px`;
        canvas.style.height = `${this.height}px`;
        canvas.width = this.width;
        canvas.height = this.height;

        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(-this.width / 2, this.width / 2, this.height / 2, -this.height / 2);

        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(new THREE.Vector3());

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        });

        this.renderer.setSize(this.width, this.height);

        let geometry = new THREE.PlaneBufferGeometry(this.width, this.height);
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