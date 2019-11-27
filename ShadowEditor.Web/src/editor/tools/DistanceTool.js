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
    }

    start() {
        app.on(`mousedown.${this.id}`, this.onMouseDown);
        app.on(`mouseup.${this.id}`, this.onMouseUp);
        app.on(`dblclick.${this.id}`, this.onDblClick);
    }

    stop() {
        app.on(`mousedown.${this.id}`, null);
        app.on(`mouseup.${this.id}`, null);
        app.on(`dblclick.${this.id}`, null);
    }

    onMouseDown(event) {
        debugger;
    }

    onMouseUp(event) {

    }

    onDblClick(event) {

    }
}

export default DistanceTool;