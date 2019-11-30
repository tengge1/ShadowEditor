import BaseTool from './BaseTool';

/**
 * 距离测量工具
 */
class DistanceTool extends BaseTool {
    constructor() {
        super();
        this.running = false;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onDblClick = this.onDblClick.bind(this);

        this.onGpuPick = this.onGpuPick.bind(this);
    }

    start() {
        app.require('line').then(() => {
            app.on(`mousedown.${this.id}`, this.onMouseDown);
            app.on(`mouseup.${this.id}`, this.onMouseUp);
            app.on(`gpuPick.${this.id}`, this.onGpuPick);
            app.on(`dblclick.${this.id}`, this.onDblClick);
        });
    }

    stop() {
        app.on(`mousedown.${this.id}`, null);
        app.on(`mouseup.${this.id}`, null);
        app.on(`gpuPick.${this.id}`, null);
        app.on(`dblclick.${this.id}`, null);
    }

    onMouseDown(event) {
        if (!this.running) {
            this.running = true;
        }
    }

    onMouseUp(event) {

    }

    onGpuPick(obj) {

    }

    onDblClick(event) {

    }
}

export default DistanceTool;