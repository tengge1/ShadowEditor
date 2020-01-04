/**
 * 3D文字
 */
class ThreeDText extends THREE.Mesh {
    constructor(text = '', options) {
        const geometry = new THREE.TextBufferGeometry(text, options);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff
        });
        super(geometry, material);

        this.name = text;
        this.userData.type = '3dtext';
    }
}

export default ThreeDText;