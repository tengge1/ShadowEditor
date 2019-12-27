import Earcut from '../../utils/Earcut';

/**
 * 多边形
 */
class Polygon extends THREE.Mesh {
    constructor() {
        let geometry = new THREE.BufferGeometry();
        geometry.addAttributes('position', new THREE.Float32BufferAttribute([], 3));

        let material = new THREE.MeshBasicMaterial();
        super(geometry, material);

        this.data = [];
    }

    addPoint(x, y, z) {
        this.data.push([x, y, z]);
        this.update();
    }

    update() {
        let vertices = Earcut.triangulate(this.data, null, 3);
        geometry.addAttributes('position', new THREE.Float32BufferAttribute(vertices, 3));
    }
}

export default Polygon;