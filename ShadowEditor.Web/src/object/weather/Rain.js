/**
 * 下雨
 */
class Rain extends THREE.Points {
    constructor() {
        let geometry = new THREE.Geometry();

        let range = 40;

        for (let i = 0; i < 1500; i++) {
            let particle = new THREE.Vector3(
                Math.random() * range - range / 2,
                Math.random() * range * 1.5,
                Math.random() * range - range / 2);
            particle.velocityY = 0.1 + Math.random() / 5;
            particle.velocityX = (Math.random() - 0.5) / 3;
            geometry.vertices.push(particle);
        }

        let material = new THREE.PointsMaterial({
            size: 3,
            transparent: true,
            opacity: 0.6,
            map: new THREE.TextureLoader().load('assets/textures/particles/raindrop-3.png'),
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            color: 0xffffff
        });
        super(geometry, material);
    }
}

export default Rain;