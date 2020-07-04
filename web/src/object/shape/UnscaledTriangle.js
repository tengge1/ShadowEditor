/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import UnscaledTriangleVertexShader from './shader/unscaled_triangle_vertex.glsl';
import UnscaledTriangleFragmentShader from './shader/unscaled_triangle_fragment.glsl';
import CanvasUtils from '../../utils/CanvasUtils';

/**
 * 不缩放三角形
 */
class UnscaledTriangle extends THREE.Mesh {
    constructor(text = L_TEXT) {
        const canvas = document.createElement('canvas');

        let geometry = new THREE.PlaneBufferGeometry();

        let material = new THREE.ShaderMaterial({
            vertexShader: UnscaledTriangleVertexShader,
            fragmentShader: UnscaledTriangleFragmentShader,
            uniforms: {
                tDiffuse: {
                    value: new THREE.CanvasTexture(canvas)
                },
                width: {
                    value: 1.0 // 设备宽度
                },
                height: {
                    value: 1.0 // 设备高度
                }
            },
            transparent: true
        });

        super(geometry, material);

        this.userData.type = 'text';
        this.setText(text);
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

        context.font = `bold ${fontSize}px "Microsoft YaHei"`;

        const width = context.measureText(text).width;
        const width2 = CanvasUtils.makePowerOfTwo(width + padding * 2);
        const height2 = CanvasUtils.makePowerOfTwo(fontSize + padding * 2);

        canvas.width = width2;
        canvas.height = height2;

        const domWidth = app.editor.renderer.domElement.width;
        const domHeight = app.editor.renderer.domElement.height;

        this.material.uniforms.width.value = width2 / domWidth;
        this.material.uniforms.height.value = height2 / domHeight;

        // 设置样式并绘制文字
        context = canvas.getContext('2d');

        context.fillStyle = 'rgba(0,0,0,0)';
        context.fillRect(0, 0, width2, height2);

        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.lineWidth = 3;

        context.font = `${fontSize}px "Microsoft YaHei"`;
        context.strokeStyle = '#333';
        context.strokeText(text, width2 / 2, height2 / 2);

        context.font = `bold ${fontSize}px "Microsoft YaHei"`;
        context.fillStyle = '#fff';
        context.fillText(text, width2 / 2, height2 / 2);

        // 更新贴图
        map.needsUpdate = true;
    }
}

export default UnscaledTriangle;