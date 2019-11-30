import BaseTool from './BaseTool';

/**
 * 距离测量工具
 */
class DistanceTool extends BaseTool {
    constructor() {
        super();
        this.running = false;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onDblClick = this.onDblClick.bind(this);

        this.onGpuPick = this.onGpuPick.bind(this);
    }

    start() {
        if (!this.init) {
            this.init = true;
            this.positions = [];
            this.lines = [];
            this.world = new THREE.Vector3();
        }

        this.positions.length = 0;

        app.require('line').then(() => {
            app.on(`mousedown.${this.id}`, this.onMouseDown);
            app.on(`gpuPick.${this.id}`, this.onGpuPick);
            app.on(`dblclick.${this.id}`, this.onDblClick);
        });
    }

    stop() {
        app.on(`mousedown.${this.id}`, null);
        app.on(`gpuPick.${this.id}`, null);
        app.on(`dblclick.${this.id}`, null);

        delete this.line;

        while (this.lines.length) {
            let line = this.lines[0];
            app.editor.sceneHelpers.remove(line);
        }
        this.lines.length = 0;
    }

    onMouseDown() {
        if (!this.line) {
            let geometry = new THREE.LineGeometry();
            let material = new THREE.LineMaterial({ color: Math.random() * 0xffffff });
            this.line = new THREE.Line2(geometry, material);
            this.lines.push(this.line);
            app.editor.sceneHelpers.add(this.line);
        }
        this.positions.push(this.world.x, this.world.y, this.world.z);
        this.line.geometry.setPositions(this.positions);
    }

    onGpuPick(obj) {
        if (!obj.point) {
            return;
        }
        this.world.copy(obj.point);
    }

    onDblClick() {
        this.call(`end`, this);
        delete this.line;
    }
}

export default DistanceTool;