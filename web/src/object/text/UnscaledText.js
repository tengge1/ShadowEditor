/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import UnscaledTextVertexShader from './shader/unscaled_text_vertex.glsl';
import UnscaledTextFragmentShader from './shader/unscaled_text_fragment.glsl';
import CanvasUtils from '../../utils/CanvasUtils';

let ID = -1;

/**
 * 不缩放文字
 */
class UnscaledText extends THREE.Mesh {
    constructor(text = '', options) {
        const canvas = document.createElement('canvas');

        const domWidth = options.domWidth || 1422;
        const domHeight = options.domHeight || 715;

        let geometry = new THREE.PlaneBufferGeometry();
        let material = new THREE.ShaderMaterial({
            vertexShader: UnscaledTextVertexShader,
            fragmentShader: UnscaledTextFragmentShader,
            uniforms: {
                tDiffuse: {
                    value: new THREE.CanvasTexture(canvas)
                },
                width: {
                    value: 1.0 // canvas width
                },
                height: {
                    value: 1.0 // canvas height
                },
                domWidth: {
                    value: domWidth // dom width
                },
                domHeight: {
                    value: domHeight // dom height
                }
            },
            transparent: true
        });

        super(geometry, material);

        this.userData.type = 'text';
        this.setText(text);

        app.on(`resize.${this.constructor.name}${ID--}`, this.onResize.bind(this));
    }

    setText(text) {
        let fontSize = 16;
        let padding = 4;

        this.name = text;
        this.userData.text = text;

        // 设置样式并计算文字宽度和高度
        let map = this.material.uniforms.tDiffuse.value;
        let canvas = map.image;
        let context = canvas.getContext('2d');

        context.font = `${fontSize}px "Microsoft YaHei"`;

        const width = context.measureText(text).width;
        const width2 = CanvasUtils.makePowerOfTwo(width + padding * 2);
        const height2 = CanvasUtils.makePowerOfTwo(fontSize + padding * 2);

        canvas.width = width2;
        canvas.height = height2;

        this.material.uniforms.width.value = width2;
        this.material.uniforms.height.value = height2;

        // 设置样式并绘制文字
        context = canvas.getContext('2d');

        context.imageSmoothingQuality = 'high';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.lineWidth = 2;

        let halfWidth = width2 / 2;
        let halfHeight = height2 / 2;

        // 画描边
        context.font = `${fontSize}px "Microsoft YaHei"`;
        context.strokeStyle = '#000';
        context.strokeText(text, halfWidth, halfHeight);

        // 画文字
        context.fillStyle = '#fff';
        context.fillText(text, halfWidth, halfHeight);

        // 更新贴图
        map.needsUpdate = true;
    }

    onResize() {
        // TODO: 播放器中大小
        const { width, height } = app.editor.renderer.domElement;
        this.material.uniforms.domWidth.value = width;
        this.material.uniforms.domHeight.value = height;
    }
}

export default UnscaledText;