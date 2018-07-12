import BaseSerializer from './BaseSerializer';
import SerializerType from './SerializerType';

/**
 * 应用序列化和反序列化
 */
const Converter = {
    toJSON: function (app) {
        // 需要序列化的对象
        var config = app.editor.config;
        var camera = app.editor.camera;
        var scene = app.editor.scene;
        var script = app.editor.script;
        var selected = app.editor.selected;

        debugger

        // 开始序列化
        var list = [];

        var configJSON = config.toJSON();

        return list;
    },

    fromJSON: function (json) {

    }
};

export default Converter;
