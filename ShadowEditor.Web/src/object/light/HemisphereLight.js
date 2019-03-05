import vertexShader from './shader/hemisphere_vertex.glsl';
import fragmentShader from './shader/hemisphere_fragment.glsl';

/**
 * 半球光
 * @param {*} skyColor 
 * @param {*} groundColor 
 * @param {*} intensity 
 */
function HemisphereLight(skyColor, groundColor, intensity) {
    THREE.HemisphereLight.call(this, skyColor, groundColor, intensity);

    // var uniforms = {
    //     topColor: { value: new THREE.Color(skyColor) },
    //     bottomColor: { value: new THREE.Color(groundColor) },
    //     offset: { value: 33 },
    //     exponent: { value: 0.6 }
    // };

    // var skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15);
    // var skyMat = new THREE.ShaderMaterial({
    //     vertexShader: vertexShader,
    //     fragmentShader: fragmentShader,
    //     uniforms: uniforms,
    //     side: THREE.BackSide
    // });

    // var sky = new THREE.Mesh(skyGeo, skyMat);
    // sky.name = L_SKY;
    // sky.userData.type = 'sky';

    // this.add(sky);
}

HemisphereLight.prototype = Object.create(THREE.HemisphereLight.prototype);
HemisphereLight.prototype.constructor = HemisphereLight;

export default HemisphereLight;
