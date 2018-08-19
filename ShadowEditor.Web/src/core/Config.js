/**
 * 系统配置
 * @author mrdoob / http://mrdoob.com/
 */
function Config(name) {
    var storage = {
        'autosave': true,
        'theme': 'assets/css/light.css',

        'project/renderer': 'WebGLRenderer',
        'project/renderer/antialias': true,
        'project/renderer/gammaInput': false,
        'project/renderer/gammaOutput': false,
        'project/renderer/shadows': true,

        'settings/history': false
    };

    if (window.localStorage[name] === undefined) {
        window.localStorage[name] = JSON.stringify(storage);
    } else {
        var data = JSON.parse(window.localStorage[name]);

        for (var key in data) {
            storage[key] = data[key];
        }
    }

    return {
        getKey: function (key) {
            return storage[key];
        },

        setKey: function () { // key, value, key, value ...
            for (var i = 0, l = arguments.length; i < l; i += 2) {
                storage[arguments[i]] = arguments[i + 1];
            }

            window.localStorage[name] = JSON.stringify(storage);

            console.log('[' + /\d\d\:\d\d\:\d\d/.exec(new Date())[0] + ']', '保存配置到LocalStorage。');
        },

        clear: function () {
            delete window.localStorage[name];
        },

        toJSON: function () {
            return storage;
        }
    };
};

export default Config;