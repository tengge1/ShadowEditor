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
                    value: 1.0 // 设备宽度
                },
                height: {
                    value: 1.0 // 设备高度
                },
                location: {
                    value: null
                }
            },
            transparent: true
        });

        super(geometry, material);

        this.material.uniforms.location.value = this.position;

        this.frusCulled = false;

        this.userData.type = 'text';
        this.setText(text);
    }

    setText(text) {
        const fontSize = 32;
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

        const domWidth = app.editor.renderer.domElement.width;
        const domHeight = app.editor.renderer.domElement.height;

        this.material.uniforms.width.value = canvas.width / domWidth;
        this.material.uniforms.height.value = canvas.height / domHeight;

        // 设置样式并绘制文字
        context = canvas.getContext('2d');

        context.textBaseline = 'hanging';
        context.imageSmoothingQuality = 'high';

        context.font = `bold ${fontSize}px "Microsoft YaHei"`;
        context.fill = '#fff';
        context.fillText(text, padding, padding);

        context.font = `normal ${fontSize}px "Microsoft YaHei"`;
        context.fill = '#555';
        context.fillText(text, padding, padding);

        // 更新贴图
        map.needsUpdate = true;
    }
}

export default PointText;