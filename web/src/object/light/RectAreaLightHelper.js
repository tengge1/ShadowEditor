/**
 * 矩形光源帮助器
 */
class RectAreaLightHelper extends THREE.Object3D {
    constructor(width, height) {
        super();

        this.name = _t('Helper');

        // 正面
        var rectLightMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial());
        rectLightMesh.scale.x = width;
        rectLightMesh.scale.y = height;

        rectLightMesh.name = _t('FrontSide');
        rectLightMesh.userData.type = 'frontSide';

        this.add(rectLightMesh);

        // 背面
        var rectLightMeshBack = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial({ color: 0x080808 }));
        rectLightMeshBack.scale.x = width;
        rectLightMeshBack.scale.y = height;
        rectLightMeshBack.rotation.y = Math.PI;

        rectLightMesh.name = _t('BackSide');
        rectLightMesh.userData.type = 'backSide';

        this.add(rectLightMeshBack);
    }
}

export default RectAreaLightHelper;