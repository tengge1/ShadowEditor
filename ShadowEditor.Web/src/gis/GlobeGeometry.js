/**
 * 地球几何体
 */
function GlobeGeometry() {
    THREE.InstancedBufferGeometry.call(this);

    this.maxInstancedCount = 4;

    var geometry = new THREE.PlaneBufferGeometry(1, 1);

    this.addAttribute('position', geometry.attributes.position);
    this.addAttribute('normal', geometry.attributes.normal);
    this.addAttribute('uv', geometry.attributes.uv);

    var offsets = [];

    for (var i = 0; i < 4; i++) {
        offsets.push((Math.random() - 0.5) * 5);
        offsets.push((Math.random() - 0.5) * 5);
        offsets.push((Math.random() - 0.5) * 5);
    }

    this.addAttribute('offset', new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3));
}

GlobeGeometry.prototype = Object.create(THREE.InstancedBufferGeometry.prototype);
GlobeGeometry.prototype.constructor = GlobeGeometry;

export default GlobeGeometry;