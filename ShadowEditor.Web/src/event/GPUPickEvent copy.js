import BaseEvent from './BaseEvent';
import DepthVertexShader from './shader/depth_vertex.glsl';
import DepthFragmentShader from './shader/depth_fragment.glsl';

/**
 * 使用GPU进行碰撞
 * @author tengge / https://github.com/tengge1
 * @param {*} app 应用程序
 */
function GPUPickEvent(app) {
    BaseEvent.call(this, app);

    this.offsetX = 0;
    this.offsetY = 0;

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
}

GPUPickEvent.prototype = Object.create(BaseEvent.prototype);
GPUPickEvent.prototype.constructor = GPUPickEvent;

GPUPickEvent.prototype.start = function () {
    app.on(`mousemove.${this.id}`, this.onMouseMove);
    app.on(`afterRender.${this.id}`, this.onAfterRender);
};

GPUPickEvent.prototype.stop = function () {
    app.on(`mousemove.${this.id}`, null);
    app.on(`afterRender.${this.id}`, null);
};

GPUPickEvent.prototype.onMouseMove = function (event) {
    if (event.target !== app.editor.renderer.domElement) {
        return;
    }
    this.offsetX = event.offsetX;
    this.offsetY = event.offsetY;
};

GPUPickEvent.prototype.onAfterRender = function () {
    let world = new THREE.Vector3();
    return function () {
        let { scene, camera, renderer } = app.editor;
        const { width, height } = renderer.domElement;

        if (this.init === undefined) {
            this.init = true;
            this.material = new THREE.ShaderMaterial({
                vertexShader: DepthVertexShader,
                fragmentShader: DepthFragmentShader
            });
            this.renderTarget = new THREE.WebGLRenderTarget(width, height);
            this.pixel = new Uint8Array(4);
        }

        // 记录旧属性
        const oldOverrideMaterial = scene.overrideMaterial;
        const oldRenderTarget = renderer.getRenderTarget();

        // 更换深度材质
        scene.overrideMaterial = this.material;
        renderer.setRenderTarget(this.renderTarget);
        renderer.clear();

        // 读取深度
        this.pixel.set([0, 0, 0, 0]);
        renderer.render(scene, camera);
        renderer.readRenderTargetPixels(this.renderTarget, this.offsetX, height - this.offsetY, 1, 1, this.pixel);

        let depth = (this.pixel[0] * 65535 + this.pixel[1] * 255 + this.pixel[2]) / 16777215 * 80 - 1;

        world.set(
            this.offsetX / width * 2 - 1,
            - this.offsetY / height * 2 + 1,
            depth
        );
        world.unproject(camera);

        // 还原原来的属性
        scene.overrideMaterial = oldOverrideMaterial;
        renderer.setRenderTarget(oldRenderTarget);
    };
}();

export default GPUPickEvent;