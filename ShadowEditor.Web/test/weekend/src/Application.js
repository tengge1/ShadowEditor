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

        // const {
        //     canvas,
        //     context
        // } = this;

        // let imgData = context.createImageData(this.width, this.height);

        // let lowerLeftCorner = new THREE.Vector3(-2, -1, -1);
        // let horizontal = new THREE.Vector3(4, 0, 0);
        // let vertical = new THREE.Vector3(0, 2, 0);
        // let origin = new THREE.Vector3(0, 0, 0);

        // let direction = new THREE.Vector3();
        // let ray = new THREE.Ray();
        // let color = new THREE.Color();

        // for (let j = 0; j < this.height; j++) {
        //     for (let i = 0; i < this.width; i++) {
        //         let u = i / this.width;
        //         let v = j / this.height;

        //         direction.set(
        //             lowerLeftCorner.x + u * horizontal.x + v * vertical.x,
        //             lowerLeftCorner.y + u * horizontal.y + v * vertical.y,
        //             lowerLeftCorner.z + u * horizontal.z + v * vertical.z,
        //         );
        //         direction.normalize();

        //         ray.set(origin, direction);

        //         this.calculateColor(ray, color);

        //         let index = j * this.width * 4 + i * 4;

        //         imgData.data[index + 0] = parseInt(255.99 * color.r);
        //         imgData.data[index + 1] = parseInt(255.99 * color.g);
        //         imgData.data[index + 2] = parseInt(255.99 * color.b);
        //         imgData.data[index + 3] = 255;
        //     }
        // }

        // context.putImageData(imgData, 0, 0);
    }

    render() {
        requestAnimationFrame(this.render);

        this.renderer.render(this.scene, this.camera);
    }
}

Application.prototype.hitSphere = function () {
    let oc = new THREE.Vector3();
    let temp = new THREE.Vector3();

    return function (center, radius, r) {
        oc.copy(r.origin).sub(center);
        let a = temp.copy(r.direction).dot(r.direction);
        let b = temp.copy(oc).dot(r.direction) * 2;
        let c = temp.copy(oc).dot(oc) - radius * radius;
        let discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            return -1;
        } else {
            return (-b - Math.sqrt(discriminant)) / (2 * a);
        }

        return discriminant > 0;
    };
}();

Application.prototype.calculateColor = function () {
    let mz = new THREE.Vector3(0, 0, -1);
    let target = new THREE.Vector3();
    let one = new THREE.Vector3(1, 1, 1);

    return function (ray, color) {
        let t = this.hitSphere(mz, 0.5, ray);

        if (t > 0) {
            // ray.at(t, target);
            // let n = target.sub(mz).normalize();

            // let rgb = n.add(one).multiplyScalar(0.5);

            // color.setRGB(rgb.x, rgb.y, rgb.z);
            color.setRGB(1.0, 0.0, 0.0);
            return;
        }

        let direction = ray.direction;

        t = 0.5 * (direction.y + 1);

        color.setRGB(
            (1 - t) * 1 + t * 0.5,
            (1 - t) * 1 + t * 0.7,
            (1 - t) * 1 + t * 1.0,
        );
    };
}();

export default Application;