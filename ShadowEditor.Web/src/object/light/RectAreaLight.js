/**
 * 点光源
 */
function RectAreaLight(color, intensity, width, height) {
    THREE.RectAreaLight.call(this, color, intensity, width, height);

    // // 正面
    // var rectLightMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial());
    // rectLightMesh.scale.x = width;
    // rectLightMesh.scale.y = height;

    // rectLightMesh.name = L_FrontSide;
    // rectLightMesh.userData.type = 'frontSide';

    // this.add(rectLightMesh);

    // var rectLightMeshBack = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial({ color: 0x080808 }));
    // rectLightMeshBack.scale.x = width;
    // rectLightMeshBack.scale.y = height;
    // rectLightMeshBack.rotation.y = Math.PI;

    // rectLightMesh.name = L_BackSide;
    // rectLightMesh.userData.type = 'backSide';

    // this.add(rectLightMeshBack);
}

RectAreaLight.prototype = Object.create(THREE.RectAreaLight.prototype);
RectAreaLight.prototype.constructor = RectAreaLight;

export default RectAreaLight;