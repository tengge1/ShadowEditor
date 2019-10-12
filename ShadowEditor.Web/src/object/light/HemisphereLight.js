import vertexShader from './shader/hemisphere_vertex.glsl';
import fragmentShader from './shader/hemisphere_fragment.glsl';

/**
 * 半球光
 * @param {*} skyColor 天空颜色
 * @param {Number} groundColor 地面颜色
 * @param {Number} intensity 强度
 */
function HemisphereLight(skyColor, groundColor, intensity) {
    THREE.HemisphereLight.call(this, skyColor, groundColor, intensity);
}

HemisphereLight.prototype = Object.create(THREE.HemisphereLight.prototype);
HemisphereLight.prototype.constructor = HemisphereLight;

export default HemisphereLight;
