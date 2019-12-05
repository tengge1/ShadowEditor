import PointMarkerVertexShader from './shader/point_marker_vertex.glsl';
import PointMarkerFragmentShader from './shader/point_marker_fragment.glsl';
import CanvasUtils from '../../utils/CanvasUtils';

let ID = -1;

/**
 * 点标注
 */
class PointMarker extends THREE.Mesh {
    constructor(text = '') {
        const canvas = document.createElement('canvas');

        let geometry = new THREE.PlaneBufferGeometry();
        let material = new THREE.ShaderMaterial({
            vertexShader: PointMarkerVertexShader,
            fragmentShader: PointMarkerFragmentShader,
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

        let triangleWidth = 24;
        let triangleHeight = 12;

        this.name = text;
        this.userData.text = text;

        // 设置样式并计算文字宽度和高度
        let map = this.material.uniforms.tDiffuse.value;
        let canvas = map.image;
        let context = canvas.getContext('2d');

        context.font = `${fontSize}px "Microsoft YaHei"`;

        const width = context.measureText(text).width;
        const width2 = CanvasUtils.makePowerOfTwo(Math.max(width, triangleWidth) + padding * 2);
        const height2 = CanvasUtils.makePowerOfTwo(fontSize + triangleHeight + padding * 3);

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
        context.textBaseline = 'hanging';
        context.textAlign = 'center';
        context.lineWidth = 4;

        let halfWidth = width2 / 2;

        // 画描边
        context.font = `${fontSize}px "Microsoft YaHei"`;
        context.strokeStyle = '#000';
        context.strokeText(text, halfWidth, padding);

        // 画文字
        context.fillStyle = '#fff';
        context.fillText(text, halfWidth, padding);

        // 画三角形
        context.beginPath();
        context.moveTo(halfWidth - triangleWidth / 2, fontSize + padding * 2);
        context.lineTo(halfWidth + triangleWidth / 2, fontSize + padding * 2);
        context.lineTo(halfWidth, fontSize + padding * 2 + triangleHeight);
        context.closePath();
        context.fillStyle = '#ff0';
        context.fill();

        // 更新贴图
        map.needsUpdate = true;
    }

    onResize() {
        const { width, height } = app.editor.renderer.domElement;
        this.material.uniforms.domWidth.value = width;
        this.material.uniforms.domHeight.value = height;
    }
}

export default PointMarker;