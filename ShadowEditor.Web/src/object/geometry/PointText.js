/**
 * 文字点
 */
class PointText extends THREE.Object3D {
    constructor(text = L_TEXT) {
        super();
        this.userData.type = 'text';
        this.setText(text);
    }

    setText(text) {
        this.name = text;
        this.userData.text = text;
    }
}

export default PointText;