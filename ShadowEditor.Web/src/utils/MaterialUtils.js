/**
 * 创建材质球图片
 * @param {*} material 材质
 * @param {*} width 宽度
 * @param {*} height 高度
 */
function createMaterialImage(material, width = 160, height = 160) {
    var scene = new THREE.Scene();

    var camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 1000);
    camera.position.z = 80;

    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);

    var light1 = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(light2);
    light2.position.set(0, 10, 10);
    light2.lookAt(new THREE.Vector3());

    var geometry = new THREE.SphereBufferGeometry(72, 32, 32);
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer.setClearColor(0xeeeeee);
    renderer.clear();
    renderer.render(scene, camera);

    geometry.dispose();
    renderer.dispose();

    return renderer.domElement;
}

/**
 * 材质工具类
 */
const MaterialUtils = {
    createMaterialImage: createMaterialImage,
};

export default MaterialUtils;