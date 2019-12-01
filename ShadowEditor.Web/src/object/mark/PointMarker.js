/**
 * 点标注
 */
class PointMarker extends THREE.Object3D {
    constructor() {
        super();

        this.userData.type = 'pointMarker';
    }
}

export default PointMarker;