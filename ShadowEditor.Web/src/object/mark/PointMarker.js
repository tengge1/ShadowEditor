import UnscaledText from '../text/UnscaledText';

/**
 * 点标注
 */
class PointMarker extends THREE.Object3D {
    constructor() {
        super();

        // 倒立圆锥体
        let geometry = new THREE.ConeBufferGeometry(1, 2);
        let material = new THREE.MeshPhongMaterial({
            color: 0xff0000
        });
        let mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);

        // 文字
        let text = new UnscaledText(`PointMarker`);
        this.add(text);

        // 便于外部使用
        this._marker = mesh;
        this._text = text;

        this.userData.type = 'pointMarker';
    }
}

export default PointMarker;