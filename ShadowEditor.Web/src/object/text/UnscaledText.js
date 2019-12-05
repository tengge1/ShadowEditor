import UnscaledTextVertexShader from './shader/unscaled_text_vertex.glsl';
import UnscaledTextFragmentShader from './shader/unscaled_text_fragment.glsl';
import CanvasUtils from '../../utils/CanvasUtils';

let ID = -1;

/**
 * 不缩放文字
 */
class UnscaledText extends THREE.Mesh {
    constructor(text = '') {
        const canvas = document.createElement('canvas');

        let geometry = new THREE.PlaneBufferGeometry();
        let material = new THREE.ShaderMaterial({
            vertexShader: UnscaledTextVertexShader,
            fragmentShader: UnscaledTextFragmentShader,
            uniforms: {
                tDiffuse: {
                    value: new THREE.CanvasTexture(canvas)
                },
                width: {
                    value: 1.0 // canvas width
                },
                height: {
                    value: 1.0 // canvas height
                },
                domWidth: {
                    value: 1.0 // dom width
                },
                domHeight: {
                    value: 1.0 // dom height
                }
            },
            transparent: true
        });

        super(geometry, material);

        this.userData.type = 'text';
        this.setText(text);

        app.on(`resize.${this.constructor.name}${ID--}`, this.onResize.bind(this));
    }

    setText(text) {
        let fontSize = 16;
        let padding = 4;

        this.name = text;
        this.userData.text = text;

        // 设置样式并计算文字宽度和高度
        let map = this.material.uniforms.tDiffuse.value;
        let canvas = map.image;
        let context = canvas.getContext('2d');

        context.font = `${fontSize}px "Microsoft YaHei"`;

        const width = context.measureText(text).width;
        const width2 = CanvasUtils.makePowerOfTwo(width + padding * 2);
        const height2 = CanvasUtils.makePowerOfTwo(fontSize + padding * 2);

        canvas.width = width2;
        canvas.height = height2;

        const domWidth = app.editor.renderer.domElement.width;
        const domHeight = app.editor.renderer.domElement.height;

        this.material.uniforms.width.value = width2;
        this.material.uniforms.height.value = height2;
        this.material.uniforms.domWidth.value = domWidth;
        this.material.uniforms.domHeight.value = domHeight;

        // 设置样式并绘制文字
        context = canvas.getContext('2d');

        context.imageSmoothingQuality = 'high';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.lineWidth = 4;

        let halfWidth = width2 / 2;
        let halfHeight = height2 / 2;

        // 画描边
        context.font = `${fontSize}px "Microsoft YaHei"`;
        context.strokeStyle = '#000';
        context.strokeText(text, halfWidth, halfHeight);

        // 画文字
        context.fillStyle = '#fff';
        context.fillText(text, halfWidth, halfHeight);

        // 更新贴图
        map.needsUpdate = true;
    }

    onResize() {
        const { width, height } = app.editor.renderer.domElement;
        this.material.uniforms.domWidth.value = width;
        this.material.uniforms.domHeight.value = height;
    }
}

export default UnscaledText;