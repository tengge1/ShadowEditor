import BaseLoader from './BaseLoader';

/**
 * DRACOLoader
 * @author tengge / https://github.com/tengge1
 */
function DRACOLoader() {
    BaseLoader.call(this);
}

DRACOLoader.prototype = Object.create(BaseLoader.prototype);
DRACOLoader.prototype.constructor = DRACOLoader;

DRACOLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        this.require('DRACOLoader').then(() => {
            THREE.DRACOLoader.setDecoderPath('assets/js/loader/draco/');
            THREE.DRACOLoader.setDecoderConfig({ type: 'js' });

            var loader = new THREE.DRACOLoader();

            loader.load(url, geometry => {
                geometry.computeVertexNormals();

                var material = new THREE.MeshStandardMaterial();
                var mesh = new THREE.Mesh(geometry, material);

                // Release decoder resources.
                THREE.DRACOLoader.releaseDecoderModule();

                resolve(mesh);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default DRACOLoader;