import BaseTool from './BaseTool';
import PointMarker from '../../object/mark/PointMarker';

/**
 * 点标注工具
 */
class PointMarkTool extends BaseTool {
    constructor() {
        super();

        this.onRaycast = this.onRaycast.bind(this);
        this.onGpuPick = this.onGpuPick.bind(this);
    }

    start() {
        if (!this.init) {
            this.init = true;
            this.world = new THREE.Vector3();
        }

        // 创建标注
        this.marker = new PointMarker();
        app.editor.sceneHelpers.add(this.marker);

        app.toast(_t('Please click on the marked position.'));

        app.on(`raycast.${this.id}`, this.onRaycast);
        app.on(`gpuPick.${this.id}`, this.onGpuPick);
    }

    stop() {
        app.on(`raycast.${this.id}`, null);
        app.on(`gpuPick.${this.id}`, null);
    }

    onRaycast(obj) { // 点击鼠标，放置标注
        this.marker.positon.copy(obj.point);
        this.call(`end`, this);
    }

    onGpuPick(obj) { // 预览标注放置效果
        if (!obj.point || !this.marker) {
            return;
        }
        this.marker.position.copy(obj.point);
    }
}

export default PointMarkTool;