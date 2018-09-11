import BaseLoader from './BaseLoader';

/**
 * LOLLoader
 * @author tengge / https://github.com/tengge1
 */
function LOLLoader() {
    BaseLoader.call(this);
}

LOLLoader.prototype = Object.create(BaseLoader.prototype);
LOLLoader.prototype.constructor = LOLLoader;

LOLLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var model = new LolModel({
            champion: '22',
            skin: 0
        });
        model.load();
        model.on('load', () => {
            var geometry = model.geometry;
            var material = model.material;
            var mesh = new THREE.Mesh(geometry, material);
            mesh.name = '寒冰射手';
            mesh.scale.set(0.1, 0.1, 0.1);
            model.setAnimation('idle');
    
            editor.execute(new AddObjectCommand(mesh));
            this.app.on('animate.Ashe', (clock, deltaTime) => {
                model.update(clock.getElapsedTime() * 1000);
            });
        });

        var loader = new THREE.ObjectLoader();

        loader.load(url, obj => {
            if (obj instanceof THREE.Scene && obj.children.length > 0 && obj.children[0] instanceof THREE.SkinnedMesh) {
                resolve(this.loadSkinnedMesh(obj));
            } else {
                resolve(obj);
            }
        }, undefined, () => {
            resolve(null);
        });
    });
};

export default LOLLoader;