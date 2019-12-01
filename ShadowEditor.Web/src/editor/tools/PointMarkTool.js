import BaseTool from './BaseTool';
import PointMarker from '../../object/mark/PointMarker';

/**
 * 点标注工具
 */
class PointMarkTool extends BaseTool {
    constructor() {
        super();

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onGpuPick = this.onGpuPick.bind(this);
        this.onDblClick = this.onDblClick.bind(this);
    }

    start() {
        if (!this.init) {
            this.init = true;
            this.world = new THREE.Vector3();
        }

        app.on(`mousedown.${this.id}`, this.onMouseDown);
        app.on(`gpuPick.${this.id}`, this.onGpuPick);
        app.on(`dblclick.${this.id}`, this.onDblClick);
    }

    stop() {
        app.on(`mousedown.${this.id}`, null);
        app.on(`gpuPick.${this.id}`, null);
        app.on(`dblclick.${this.id}`, null);
    }

    onMouseDown() {

    }

    onGpuPick(obj) {
        if (!obj.point) {
            return;
        }
        this.world.copy(obj.point);
    }

    onDblClick() {

    }
}

export default PointMarkTool;