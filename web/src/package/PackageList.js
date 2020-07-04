/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
const PackageList = [{
    name: 'NRRDLoader',
    assets: [
        'assets/js/misc/Volume.js',
        'assets/js/misc/VolumeSlice.js',
        'assets/js/loaders/NRRDLoader.js'
    ]
}, {
    name: '3MFLoader',
    assets: [
        'assets/js/loaders/3MFLoader.js'
    ]
}, {
    name: 'AMFLoader',
    assets: [
        'assets/js/loaders/AMFLoader.js'
    ]
}, {
    name: 'AssimpLoader',
    assets: [
        'assets/js/loaders/AssimpLoader.js'
    ]
}, {
    name: 'AWDLoader',
    assets: [
        'assets/js/loaders/AWDLoader.js'
    ]
}, {
    name: 'BabylonLoader',
    assets: [
        'assets/js/loaders/BabylonLoader.js'
    ]
}, {
    name: 'BinaryLoader',
    assets: [
        'assets/js/loaders/BinaryLoader.js'
    ]
}, {
    name: 'BVHLoader',
    assets: [
        'assets/js/loaders/BVHLoader.js'
    ]
}, {
    name: 'ColladaLoader',
    assets: [
        'assets/js/loaders/ColladaLoader.js'
    ]
}, {
    name: 'FBXLoader',
    assets: [
        'assets/js/curves/NURBSCurve.js',
        'assets/js/curves/NURBSUtils.js',
        'assets/js/loaders/FBXLoader.js'
    ]
}, {
    name: 'GCodeLoader',
    assets: [
        'assets/js/loaders/GCodeLoader.js'
    ]
}, {
    name: 'DRACOLoader',
    assets: [
        'assets/js/loaders/DRACOLoader.js'
    ]
}, {
    name: 'GLTFLoader',
    assets: [
        'assets/js/loaders/GLTFLoader.js'
    ]
}, {
    name: 'LegacyJSONLoader',
    assets: [
        'assets/js/loaders/deprecated/LegacyJSONLoader.js'
    ]
}, {
    name: 'KMZLoader',
    assets: [
        'assets/js/loaders/KMZLoader.js'
    ]
}, {
    name: 'MD2Loader',
    assets: [
        'assets/js/loaders/MD2Loader.js',
        'assets/js/MD2Character.js'
    ]
}, {
    name: 'OBJLoader',
    assets: [
        'assets/js/loaders/OBJLoader.js'
    ]
}, {
    name: 'OBJLoader2',
    assets: [
        'assets/js/loaders/OBJLoader2.js'
    ]
}, {
    name: 'PCDLoader',
    assets: [
        'assets/js/loaders/PCDLoader.js'
    ]
}, {
    name: 'PDBLoader',
    assets: [
        'assets/js/loaders/PDBLoader.js'
    ]
}, {
    name: 'PLYLoader',
    assets: [
        'assets/js/loaders/PLYLoader.js'
    ]
}, {
    name: 'PRWMLoader',
    assets: [
        'assets/js/loaders/PRWMLoader.js'
    ]
}, {
    name: 'STLLoader',
    assets: [
        'assets/js/loaders/STLLoader.js'
    ]
}, {
    name: 'TDSLoader',
    assets: [
        'assets/js/loaders/TDSLoader.js'
    ]
}, {
    name: 'VRMLoader',
    assets: [
        'assets/js/loaders/VRMLoader.js'
    ]
}, {
    name: 'VRMLLoader',
    assets: [
        'assets/js/loaders/VRMLLoader.js'
    ]
}, {
    name: 'VTKLoader',
    assets: [
        'assets/js/loaders/VTKLoader.js'
    ]
}, {
    name: 'CTMLoader',
    assets: [
        'assets/js/libs/ctm.js',
        'assets/js/loaders/ctm/CTMLoader.js'
    ]
}, {
    name: 'XLoader',
    assets: [
        'assets/js/loaders/XLoader.js'
    ]
}, {
    name: 'SEA3D',
    assets: [
        'assets/js/loaders/sea3d/SEA3D.js',
        'assets/js/loaders/sea3d/SEA3DLZMA.js',
        'assets/js/loaders/sea3d/SEA3DLoader.js',
        'assets/js/libs/draco/draco_decoder.js',
        'assets/js/loaders/sea3d/SEA3DDraco.js'
    ]
}, {
    name: 'lzma',
    assets: [
        'assets/js/libs/lzma.js'
    ]
}, {
    name: 'codemirror',
    assets: [
        'assets/css/codemirror.css',
        'assets/css/theme/monokai.css',
        'assets/js/codemirror.js',
        'assets/js/mode/javascript.js',
        'assets/js/mode/glsl.js'
    ]
}, {
    name: 'codemirror-addon',
    assets: [
        'assets/css/addon/dialog.css',
        'assets/css/addon/show-hint.css',
        'assets/css/addon/tern.css',
        'assets/js/addon/dialog.js',
        'assets/js/addon/show-hint.js'
    ]
}, {
    name: 'esprima',
    assets: [
        'assets/js/esprima.js'
    ]
}, {
    name: 'jsonlint',
    assets: [
        'assets/js/jsonlint.js'
    ]
}, {
    name: 'glslprep',
    assets: [
        'assets/js/glslprep.min.js'
    ]
}, {
    name: 'acorn',
    assets: [
        'assets/js/acorn/acorn.js',
        'assets/js/acorn/acorn_loose.js',
        'assets/js/acorn/walk.js'
    ]
}, {
    name: 'ternjs',
    assets: [
        'assets/js/addon/tern.js',
        'assets/js/ternjs/polyfill.js',
        'assets/js/ternjs/signal.js',
        'assets/js/ternjs/tern.js',
        'assets/js/ternjs/def.js',
        'assets/js/ternjs/comment.js',
        'assets/js/ternjs/infer.js',
        'assets/js/ternjs/doc_comment.js',
        'assets/js/tern-threejs/threejs.js'
    ]
}, {
    name: 'line',
    assets: [
        'assets/js/lines/LineSegmentsGeometry.js',
        'assets/js/lines/LineGeometry.js',
        'assets/js/lines/WireframeGeometry2.js',
        'assets/js/lines/LineMaterial.js',
        'assets/js/lines/LineSegments2.js',
        'assets/js/lines/Line2.js',
        'assets/js/lines/Wireframe.js'
    ]
}, {
    name: 'GLTFExporter',
    assets: [
        'assets/js/exporters/GLTFExporter.js'
    ]
}, {
    name: 'OBJExporter',
    assets: [
        'assets/js/exporters/OBJExporter.js'
    ]
}, {
    name: 'PLYExporter',
    assets: [
        'assets/js/exporters/PLYExporter.js'
    ]
}, {
    name: 'STLBinaryExporter',
    assets: [
        'assets/js/exporters/STLBinaryExporter.js'
    ]
}, {
    name: 'STLExporter',
    assets: [
        'assets/js/exporters/STLExporter.js'
    ]
}, {
    name: 'MMD',
    assets: [
        'assets/js/libs/mmdparser.min.js',
        'assets/js/loaders/MMDLoader.js',
        'assets/js/animation/CCDIKSolver.js',
        'assets/js/animation/MMDPhysics.js',
        'assets/js/animation/MMDAnimationHelper.js'
    ]
}, {
    name: 'gl-matrix',
    assets: [
        'assets/js/libs/gl-matrix.js'
    ]
}, {
    name: 'pako',
    assets: [
        'assets/js/libs/pako.js'
    ]
}, {
    name: 'NormalMapShader',
    assets: [
        'assets/js/shaders/NormalMapShader.js'
    ]
}, {
    name: 'FXAAShader',
    assets: [
        'assets/js/shaders/FXAAShader.js'
    ]
}, {
    name: 'DotScreenShader',
    assets: [
        'assets/js/shaders/DotScreenShader.js'
    ]
}, {
    name: 'RGBShiftShader',
    assets: [
        'assets/js/shaders/RGBShiftShader.js'
    ]
}, {
    name: 'AfterimageShader',
    assets: [
        'assets/js/shaders/AfterimageShader.js'
    ]
}, {
    name: 'BokehShader',
    assets: [
        'assets/js/shaders/BokehShader.js'
    ]
}, {
    name: 'DigitalGlitch',
    assets: [
        'assets/js/shaders/DigitalGlitch.js'
    ]
}, {
    name: 'HalftoneShader',
    assets: [
        'assets/js/shaders/HalftoneShader.js'
    ]
}, {
    name: 'DepthLimitedBlurShader',
    assets: [
        'assets/js/shaders/DepthLimitedBlurShader.js'
    ]
}, {
    name: 'UnpackDepthRGBAShader',
    assets: [
        'assets/js/shaders/UnpackDepthRGBAShader.js'
    ]
}, {
    name: 'PixelShader',
    assets: [
        'assets/js/shaders/PixelShader.js'
    ]
}, {
    name: 'SAOShader',
    assets: [
        'assets/js/shaders/SAOShader.js'
    ]
}, {
    name: 'SMAAShader',
    assets: [
        'assets/js/shaders/SMAAShader.js'
    ]
}, {
    name: 'SSAOShader',
    assets: [
        'assets/js/shaders/SSAOShader.js'
    ]
}, {
    name: 'MaskPass',
    assets: [
        'assets/js/postprocessing/MaskPass.js'
    ]
}, {
    name: 'AfterimagePass',
    assets: [
        'assets/js/postprocessing/AfterimagePass.js'
    ]
}, {
    name: 'BokehPass',
    assets: [
        'assets/js/postprocessing/BokehPass.js'
    ]
}, {
    name: 'GlitchPass',
    assets: [
        'assets/js/postprocessing/GlitchPass.js'
    ]
}, {
    name: 'HalftonePass',
    assets: [
        'assets/js/postprocessing/HalftonePass.js'
    ]
}, {
    name: 'SSAARenderPass',
    assets: [
        'assets/js/postprocessing/SSAARenderPass.js'
    ]
}, {
    name: 'SMAAPass',
    assets: [
        'assets/js/postprocessing/SMAAPass.js'
    ]
}, {
    name: 'TAARenderPass',
    assets: [
        'assets/js/postprocessing/TAARenderPass.js'
    ]
}, {
    name: 'CopyShader',
    assets: [
        'assets/js/shaders/CopyShader.js'
    ]
}, {
    name: 'EffectComposer',
    assets: [
        'assets/js/postprocessing/EffectComposer.js'
    ]
}, {
    name: 'RenderPass',
    assets: [
        'assets/js/postprocessing/RenderPass.js'
    ]
}, {
    name: 'ShaderPass',
    assets: [
        'assets/js/postprocessing/ShaderPass.js'
    ]
}, {
    name: 'OutlinePass',
    assets: [
        'assets/js/postprocessing/OutlinePass.js'
    ]
}, {
    name: 'SAOPass',
    assets: [
        'assets/js/postprocessing/SAOPass.js'
    ]
}, {
    name: 'SSAOPass',
    assets: [
        'assets/js/postprocessing/SSAOPass.js'
    ]
}, {
    name: 'FirstPersonControls',
    assets: [
        'assets/js/controls/FirstPersonControls.js'
    ]
}, {
    name: 'FlyControls',
    assets: [
        'assets/js/controls/FlyControls.js'
    ]
}, {
    name: 'EditorControls',
    assets: [
        'assets/js/controls/EditorControls.js'
    ]
}, {
    name: 'OrbitControls',
    assets: [
        'assets/js/controls/OrbitControls.js'
    ]
}, {
    name: 'PointerLockControls',
    assets: [
        'assets/js/controls/PointerLockControls.js'
    ]
}, {
    name: 'TrackballControls',
    assets: [
        'assets/js/controls/TrackballControls.js'
    ]
}, {
    name: 'TransformControls',
    assets: [
        'assets/js/controls/TransformControls.js'
    ]
}, {
    name: 'SPE',
    assets: [
        'assets/js/SPE.js'
    ]
}, {
    name: 'VolumetricFire',
    assets: [
        'assets/js/VolumetricFire.js'
    ]
}, {
    name: 'ammo',
    assets: [
        'assets/js/libs/ammo.js'
    ]
}, {
    name: 'chevrotain',
    assets: [
        'assets/js/libs/chevrotain.min.js'
    ]
}, {
    name: 'TexGen',
    assets: [
        'assets/js/libs/TexGen.js'
    ]
}, {
    name: 'ColladaExporter',
    assets: [
        'assets/js/exporters/ColladaExporter.js'
    ]
}, {
    name: 'DRACOExporter',
    assets: [
        'assets/js/libs/draco/draco_encoder.js',
        'assets/js/exporters/DRACOExporter.js'
    ]
}, {
    name: 'MTLLoader',
    assets: [
        'assets/js/loaders/MTLLoader.js'
    ]
}, {
    name: 'LoaderSupport',
    assets: [
        'assets/js/loaders/LoaderSupport.js'
    ]
}, {
    name: 'opentype',
    assets: [
        'assets/js/libs/opentype.js'
    ]
}, {
    name: 'GodRaysShader',
    assets: [
        'assets/js/shaders/GodRaysShader.js'
    ]
}];

export default PackageList;