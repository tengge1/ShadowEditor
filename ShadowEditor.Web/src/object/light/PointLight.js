/**
 * 点光源
 */
function PointLight(color, intensity, distance, decay) {
    THREE.PointLight.call(this, color, intensity, distance, decay);

    var geometry = new THREE.SphereBufferGeometry(0.2, 16, 8);
    var material = new THREE.MeshBasicMaterial({
        color: color
    });
    var mesh = new THREE.Mesh(geometry, material);

    // 帮助器
    mesh.name = '帮助器';
    mesh.userData.type = 'helper';

    this.add(mesh);

    // 光晕
    var textureLoader = new THREE.TextureLoader();
    var textureFlare0 = textureLoader.load('assets/textures/lensflare/lensflare0.png');
    var textureFlare3 = textureLoader.load('assets/textures/lensflare/lensflare3.png');

    // 光晕
    var lensflare = new THREE.Lensflare();
    lensflare.addElement(new THREE.LensflareElement(textureFlare0, 40, 0.01, new THREE.Color(color)));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.2));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 35, 0.4));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.6));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 45, 0.8));

    lensflare.name = '光晕';
    lensflare.userData.type = 'lensflare';

    this.add(lensflare);
}

PointLight.prototype = Object.create(THREE.PointLight.prototype);
PointLight.prototype.constructor = PointLight;

export default PointLight;