import BaseLoader from './BaseLoader';

/**
 * AWDLoader
 * @param {*} app 
 */
function AWDLoader(app) {
    BaseLoader.call(this, app);
}

AWDLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.AWDLoader();

        loader.load(this.app.options.server + model.Url, (obj3d) => {
            resolve(obj3d);
        });
    });
};

export default AWDLoader;