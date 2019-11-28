/**
 * 点文字
 */
class PointText extends THREE.Mesh {
    constructor(text = L_TEXT) {
        const canvas = document.createElement('canvas');

        const geometry = new THREE.PlaneGeometry();
        const material = new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(canvas)
        });

        super(geometry, material);

        this.userData.type = 'text';
        this.setText(text);
    }

    setText(text) {
        const fontSize = 20;
        const padding = 2;

        this.name = text;
        this.userData.text = text;

        // 设置样式并计算文字宽度和高度
        let canvas = this.material.map.image;
        let context = canvas.getContext('2d');

        context.font = `${fontSize}px "Microsoft YaHei"`;

        const width = context.measureText(text).width;
        canvas.width = width + padding * 2;
        canvas.height = fontSize + padding * 2;

        // 设置样式并绘制文字
        context = canvas.getContext('2d');

        context.font = `${fontSize}px "Microsoft YaHei"`;

        context.stroke = '#fff';
        context.strokeText(text, padding, padding);

        context.fill = '#555';
        context.fillText(text, padding, padding);

        // 更新贴图
        this.material.map.needsUpdate = true;
    }
}

export default PointText;