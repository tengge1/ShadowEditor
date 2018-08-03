import BaseSerializer from '../BaseSerializer';
// import Application from '../../Application';

/**
 * 配置序列化器
 */
function ConfigSerializer() {
    BaseSerializer.call(this);
}

ConfigSerializer.prototype = Object.create(BaseSerializer.prototype);
ConfigSerializer.prototype.constructor = ConfigSerializer;

ConfigSerializer.prototype.filter = function (obj) {
    // TODO: 消除rollup打包Circular dependency警告

    // if (obj instanceof Application) {
    //     return true;
    // } else if (obj.metadata && obj.metadata.generator === this.constructor.name) {
    //     return true;
    // } else {
    //     return false;
    // }
    return false;
};

ConfigSerializer.prototype.toJSON = function (app) {
    var json = BaseSerializer.prototype.toJSON(app);
    Object.assign(json, app.editor.config.toJSON());
    return json;
};

ConfigSerializer.prototype.fromJSON = function (app, json) {
    Object.keys(json).forEach(key => {
        app.editor.config.setKey(key, json[key]);
    });
};

export default ConfigSerializer;