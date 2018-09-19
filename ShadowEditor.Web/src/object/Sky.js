import BaseObject from './BaseObject';

/**
 * 天空
 */
function Sky() {
    BaseObject.call(this);

    var distance = 400000;

    var sky = new THREE.Sky();
    sky.scale.setScalar(450000);

    this.add(sky);

    var sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(20000, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    sunSphere.position.y = - 700000;
    sunSphere.visible = false;

    this.add(sunSphere);

    var uniforms = sky.material.uniforms;
    uniforms.turbidity.value = 10;
    uniforms.rayleigh.value = 2;
    uniforms.luminance.value = 1;
    uniforms.mieCoefficient.value = 0.005;
    uniforms.mieDirectionalG.value = 0.8;
    var theta = Math.PI * (0.49 - 0.5);
    var phi = 2 * Math.PI * (0.25 - 0.5);
    sunSphere.position.x = distance * Math.cos(phi);
    sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
    sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
    sunSphere.visible = true;
    uniforms.sunPosition.value.copy(sunSphere.position);
}

Sky.prototype = Object.create(BaseObject.prototype);
Sky.prototype.constructor = Sky;

export default Sky;