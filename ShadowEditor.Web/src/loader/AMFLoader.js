import BaseLoader from './BaseLoader';

/**
 * AMF模型下载器
 * @param {*} app 
 */
function AMFLoader(app) {
    BaseLoader.call(this, app);
}

AMFLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.AMFLoader();
        loader.load(this.app.options.server + model.Url, (group) => {
            resolve(group);
        });
    });
};

export default AMFLoader;