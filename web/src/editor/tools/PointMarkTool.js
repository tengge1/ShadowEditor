/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseTool from './BaseTool';
import PointMarker from '../../object/mark/PointMarker';
import global from '../../global';

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
        this.marker = new PointMarker('', {
            domWidth: global.app.editor.renderer.domElement.width,
            domHeight: global.app.editor.renderer.domElement.height
        });
        global.app.editor.sceneHelpers.add(this.marker);

        global.app.toast(_t('Please click on the marked position.'));

        global.app.on(`raycast.${this.id}`, this.onRaycast);
        global.app.on(`gpuPick.${this.id}`, this.onGpuPick);
    }

    stop() {
        this.marker = null;
        global.app.on(`raycast.${this.id}`, null);
        global.app.on(`gpuPick.${this.id}`, null);
    }

    onRaycast(obj) { // 点击鼠标，放置标注
        if (!obj.point) {
            return;
        }
        const value = obj.object && obj.object.name ? obj.object.name : '';

        this.marker.position.copy(obj.point);

        // 标注要沿着平面法线方向
        if (obj.face) {
            this.marker.lookAt(this.marker.position.clone().add(obj.face.normal));
        }

        global.app.prompt({
            title: _t('Input marker name:'),
            content: _t('Marker name'),
            value,
            mask: true,
            onOK: text => {
                this.marker.setText(text);

                global.app.editor.sceneHelpers.remove(this.marker);
                global.app.editor.addObject(this.marker);

                this.stop();
                this.call(`end`, this);
            },
            onClose: () => {
                if (this.marker) {
                    global.app.editor.removeObject(this.marker);
                }
                this.stop();
                this.call(`end`, this);
            }
        });
    }

    onGpuPick(obj) { // 预览标注放置效果
        if (!obj.point || !this.marker) {
            return;
        }
        if (obj.object && this.marker.name !== obj.object.name) {
            this.marker.setText(obj.object.name);
        } else {
            this.marker.setText('');
        }
        this.marker.position.copy(obj.point);
    }
}

export default PointMarkTool;