import UnscaledText from '../text/UnscaledText';

/**
 * 点标注
 */
class PointMarker extends THREE.Object3D {
    constructor() {
        super();

        // 倒立圆锥体
        let geometry = new THREE.ConeBufferGeometry(0.4, 1);
        let material = new THREE.MeshPhongMaterial({
            color: 0xff0000
        });

        let mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = Math.PI;
        mesh.updateMatrix();

        geometry.computeBoundingBox();
        let box = geometry.boundingBox.clone().applyMatrix4(mesh.matrix);
        mesh.translateY(-box.max.y);

        this.add(mesh);

        // 文字
        let text = new UnscaledText(``);
        text.translateY(Math.abs(box.max.y) + Math.abs(box.min.y) + 0.5);
        this.add(text);

        // 便于外部使用
        this._marker = mesh;
        this._text = text;

        this.userData.type = 'pointMarker';
    }
    setText(text) {
        this.name = text;
        this.userData.text = text;
        this._text.setText(text);
    }
}

export default PointMarker;