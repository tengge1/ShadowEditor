import BaseLoader from './BaseLoader';

/**
 * AMFLoader
 * @param {*} app 
 */
function AMFLoader(app) {
    BaseLoader.call(this, app);
}

AMFLoader.prototype = Object.create(BaseLoader.prototype);
AMFLoader.prototype.constructor = AMFLoader;

AMFLoader.prototype.load = function (url) {
    return new Promise(resolve => {
        var loader = new THREE.AMFLoader();
        loader.load(url, (group) => {
            resolve(group);
        });
    });
};

export default AMFLoader;