import PointTextVertexShader from './shader/point_text_vertex.glsl';
import PointTextFragmentShader from './shader/point_text_fragment.glsl';

/**
 * 点文字
 */
class PointText extends THREE.Mesh {
    constructor(text = L_TEXT) {
        const canvas = document.createElement('canvas');

        let geometry = new THREE.PlaneBufferGeometry();
        let material = new THREE.ShaderMaterial({
            vertexShader: PointTextVertexShader,
            fragmentShader: PointTextFragmentShader,
            uniforms: {
                tDiffuse: {
                    value: new THREE.CanvasTexture(canvas)
                },
                width: {
                    value: 100.0
                },
                height: {
                    value: 80.0
                }
            },
            transparent: true
        });

        super(geometry, material);

        this.userData.type = 'text';
        this.setText(text);
    }

    setText(text) {
        const fontSize = 12;
        const padding = 2;

        this.name = text;
        this.userData.text = text;

        // 设置样式并计算文字宽度和高度
        let map = this.material.uniforms.tDiffuse.value;
        let canvas = map.image;
        let context = canvas.getContext('2d');

        context.font = `${fontSize}px "Microsoft YaHei"`;

        const width = context.measureText(text).width;
        canvas.width = width + padding * 2;
        canvas.height = fontSize + padding * 2;

        this.material.uniforms.width.value = canvas.width;
        this.material.uniforms.height.value = canvas.height;

        // 设置样式并绘制文字
        context = canvas.getContext('2d');

        context.font = `${fontSize}px "Microsoft YaHei"`;
        context.textBaseline = 'hanging';
        context.imageSmoothingQuality = 'high';

        context.stroke = '#fff';
        context.strokeText(text, padding, padding);

        context.fill = '#555';
        context.fillText(text, padding, padding);

        // 更新贴图
        map.needsUpdate = true;
    }
}

export default PointText;