import BaseSerializer from './BaseSerializer';
import Serializers from './Serializers';

/**
 * 应用序列化和反序列化
 */
const Converter = {
    toJSON: function (app) {
        var list = [];

        // 配置
        var config = {
            Metadata: Serializers.Config.Metadata,
            Object: Serializers.Config.Serializer.toJSON(app.editor.config),
        };
        list.push(config);

        // 相机
        var camera = {
            Metadata: Serializers.PerspectiveCamera.Metadata,
            Object: Serializers.PerspectiveCamera.Serializer.toJSON(app.editor.camera)
        };
        list.push(camera);

        // 脚本
        Object.keys(app.editor.scripts).forEach(function (id) {
            var name = app.editor.scripts[id].name;
            var source = app.editor.scripts[id].source;
            var script = {
                Metadata: Serializers['Script'].Metadata,
                Object: Serializers['Script'].Serializer.toJSON({
                    id: id,
                    name: name,
                    source: source
                })
            };
            list.push(script);
        });

        // 场景
        app.editor.scene.traverse(function (obj) {
            if (Serializers[obj.constructor.name] != null) {
                var json = {
                    Metadata: Serializers[obj.constructor.name].Metadata,
                    Object: Serializers[obj.constructor.name].Serializer.toJSON(obj)
                };
                list.push(json);
            } else {
                console.log(`There is no serializer to serialize ${obj.name}`);
            }
        });

        return list;
    },

    fromJSON: function (json) {

    }
};

export default Converter;
