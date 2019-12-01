/**
 * 线标注
 */
class LineStringMarker extends THREE.Object3D {
    constructor() {
        super();

        this.userData.type = 'lineStringMarker';
    }
}

export default LineStringMarker;