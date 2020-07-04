/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/ExtensionWindow.css';
import { Window, Content, Buttons, DataGrid, Column, Button } from '../../../ui/index';

const DESCRIPTIONS = {
    'ANGLE_instanced_arrays': 'The ANGLE_instanced_arrays extension is part of the WebGL API and allows to draw the same object, or groups of similar objects multiple times, if they share the same vertex data, primitive count and type.',
    'EXT_blend_minmax': 'The EXT_blend_minmax extension is part of the WebGL API and extends blending capabilities by adding two new blend equations: the minimum or maximum color components of the source and destination colors.',
    'EXT_color_buffer_float': 'The EXT_color_buffer_float extension is part of WebGL and adds the ability to render a variety of floating point formats.',
    'EXT_color_buffer_half_float': 'The EXT_color_buffer_half_float extension is part of the WebGL API and adds the ability to render to 16-bit floating-point color buffers.',
    'EXT_disjoint_timer_query': 'The EXT_disjoint_timer_query extension is part of the WebGL API and provides a way to measure the duration of a set of GL commands, without stalling the rendering pipeline.',
    'EXT_float_blend': "The WebGL API's EXT_float_blend extension allows blending and draw buffers with 32-bit floating-point components.",
    'EXT_frag_depth': 'The EXT_frag_depth extension is part of the WebGL API and enables to set a depth value of a fragment from within the fragment shader.',
    'EXT_sRGB': 'The EXT_sRGB extension is part of the WebGL API and adds sRGB support to textures and framebuffer objects.',
    'EXT_shader_texture_lod': 'The EXT_shader_texture_lod extension is part of the WebGL API and adds additional texture functions to the OpenGL ES Shading Language which provide the shader writer with explicit control of LOD (Level of detail).',
    'EXT_texture_compression_bptc': "The EXT_texture_compression_bptc extension is part of the WebGL API and exposes 4 BPTC compressed texture formats. These compression formats are called BC7 and BC6H in Microsoft's DirectX API.",
    'EXT_texture_compression_rgtc': 'The EXT_texture_compression_rgtc extension is part of the WebGL API and exposes 4 RGTC compressed texture formats. RGTC is a block-based texture compression format suited for unsigned and signed red and red-green textures (Red-Green Texture Compression).',
    'EXT_texture_filter_anisotropic': 'The EXT_texture_filter_anisotropic extension is part of the WebGL API and exposes two constants for anisotropic filtering (AF).',
    'OES_element_index_uint': 'The OES_element_index_uint extension is part of the WebGL API and adds support for gl.UNSIGNED_INT types to WebGLRenderingContext.drawElements().',
    'OES_fbo_render_mipmap': 'The OES_fbo_render_mipmap extension is part of the WebGL API and makes it possible to attach any level of a texture to a framebuffer object.',
    'OES_standard_derivatives': 'The OES_standard_derivatives extension is part of the WebGL API and adds the GLSL derivative functions dFdx, dFdy, and fwidth.',
    'OES_texture_float': 'The OES_texture_float extension is part of the WebGL API and exposes floating-point pixel types for textures.',
    'OES_texture_float_linear': 'The OES_texture_float_linear extension is part of the WebGL API and allows linear filtering with floating-point pixel types for textures.',
    'OES_texture_half_float': 'The OES_texture_half_float extension is part of the WebGL API and adds texture formats with 16- (aka half float) and 32-bit floating-point components.',
    'OES_texture_half_float_linear': 'The OES_texture_half_float_linear extension is part of the WebGL API and allows linear filtering with half floating-point pixel types for textures.',
    'OES_vertex_array_object': 'The OES_vertex_array_object extension is part of the WebGL API and provides vertex array objects (VAOs) which encapsulate vertex array states. These objects keep pointers to vertex data and provide names for different sets of vertex data.',
    'OVR_multiview2': 'The OVR_multiview2 extension is part of the WebGL API and adds support for rendering into multiple views simultaneously. This especially useful for virtual reality (VR) and WebXR.',
    'WEBGL_color_buffer_float': 'The WEBGL_color_buffer_float extension is part of the WebGL API and adds the ability to render to 32-bit floating-point color buffers.',
    'WEBGL_compressed_texture_astc': 'The WEBGL_compressed_texture_astc extension is part of the WebGL API and exposes Adaptive Scalable Texture Compression (ASTC) compressed texture formats to WebGL.',
    'WEBGL_compressed_texture_atc': 'The WEBGL_compressed_texture_atc extension is part of the WebGL API and exposes 3 ATC compressed texture formats. ATC is a proprietary compression algorithm for compressing textures on handheld devices.',
    'WEBGL_compressed_texture_etc': 'The WEBGL_compressed_texture_etc extension is part of the WebGL API and exposes 10 ETC/EAC compressed texture formats.',
    'WEBGL_compressed_texture_etc1': 'The WEBGL_compressed_texture_etc1 extension is part of the WebGL API and exposes the ETC1 compressed texture format.',
    'WEBGL_compressed_texture_pvrtc': 'The WEBGL_compressed_texture_pvrtc extension is part of the WebGL API and exposes four PVRTC compressed texture formats.',
    'WEBGL_compressed_texture_s3tc': 'The WEBGL_compressed_texture_s3tc extension is part of the WebGL API and exposes four S3TC compressed texture formats.',
    'WEBGL_compressed_texture_s3tc_srgb': 'The WEBGL_compressed_texture_s3tc_srgb extension is part of the WebGL API and exposes four S3TC compressed texture formats for the sRGB colorspace.',
    'WEBGL_debug_renderer_info': 'The WEBGL_debug_renderer_info extension is part of the WebGL API and exposes two constants with information about the graphics driver for debugging purposes.',
    'WEBGL_debug_shaders': 'The WEBGL_debug_shaders extension is part of the WebGL API and exposes a method to debug shaders from privileged contexts.',
    'WEBGL_depth_texture': 'The WEBGL_depth_texture extension is part of the WebGL API and defines 2D depth and depth-stencil textures.',
    'WEBGL_draw_buffers': 'The WEBGL_draw_buffers extension is part of the WebGL API and enables a fragment shader to write to several textures, which is useful for deferred shading, for example.',
    'WEBGL_lose_context': 'The WEBGL_lose_context extension is part of the WebGL API and exposes functions to simulate losing and restoring a WebGLRenderingContext.'
};

/**
 * 扩展窗口
 * @author tengge / https://github.com/tengge1
 */
class ExtensionWindow extends React.Component {
    constructor(props) {
        super(props);

        this.renderDescription = this.renderDescription.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        let list = [];

        const context = app.editor.renderer.getContext();
        const extensions = context.getSupportedExtensions();

        extensions.forEach(n => {
            const key = n.startsWith('WEBKIT_') ? n.substring(7) : n;
            list.push({
                Name: n,
                Description: DESCRIPTIONS[key]
            });
        });

        return <Window
            className={'ExtensionWindow'}
            title={_t('WebGL Extensions')}
            style={{ width: '1000px', height: '400px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <DataGrid data={list}
                    keyField={'Name'}
                >
                    <Column type={'number'}
                        title={'#'}
                    />
                    <Column field={'Name'}
                        title={_t('Name')}
                        width={200}
                    />
                    <Column field={'Description'}
                        title={_t('Description')}
                        danger
                        renderer={this.renderDescription}
                    />
                </DataGrid>
            </Content>
            <Buttons>
                <Button onClick={this.handleClose}>{_t('Close')}</Button>
            </Buttons>
        </Window>;
    }

    renderDescription(value, row) {
        if (row.Description) {
            let name = row.Name;
            if (name.startsWith('WEBKIT_')) {
                name = name.substring(7);
            }
            return `${value} [<a href="https://developer.mozilla.org/en-US/docs/Web/API/${name}" target="_blank">${_t('MDN')}</a>]`;
        } else {
            return value;
        }
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default ExtensionWindow;