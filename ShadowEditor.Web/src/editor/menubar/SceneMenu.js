import UI from '../../ui/UI';
import SceneWindow from '../window/SceneWindow';
import Converter from '../../serialization/Converter';
import Ajax from '../../utils/Ajax';

/**
 * 场景菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SceneMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

SceneMenu.prototype = Object.create(UI.Control.prototype);
SceneMenu.prototype.constructor = SceneMenu;

SceneMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '场景'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                html: '新建',
                cls: 'option',
                onClick: this.newScene.bind(this)
            }, {
                xtype: 'div',
                html: '载入',
                cls: 'option',
                onClick: this.loadScene.bind(this)
            }, {
                xtype: 'div',
                html: '保存',
                cls: 'option',
                onClick: this.saveScene.bind(this)
            }, {
                xtype: 'div',
                html: '另存为',
                cls: 'option',
                onClick: this.saveAsScene.bind(this)
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                html: '发布',
                cls: 'option',
                onClick: this.publishScene.bind(this)
            }]
        }]
    });

    container.render();

    // this.link = document.createElement('a');
    // this.link.style.display = 'none';
    // document.body.appendChild(this.link); // Firefox workaround, see #6594
}

// ---------------------------- 新建场景 ---------------------------------

SceneMenu.prototype.newScene = function () {
    var editor = this.app.editor;

    if (editor.sceneName == null) {
        editor.clear();
        document.title = '未命名';
        return;
    }

    UI.confirm('询问', '所有未保存数据将丢失，确定要新建场景吗？', function (event, btn) {
        if (btn === 'ok') {
            editor.clear();
            editor.sceneID = null;
            editor.sceneName = null;
            document.title = '未命名';
        }
    });
};

// --------------------------- 载入场景 --------------------------------------

SceneMenu.prototype.loadScene = function () {
    if (this.window == null) {
        this.window = new SceneWindow({ app: this.app });
        this.window.render();
    }
    this.window.show();
};

// --------------------------- 保存场景 ----------------------------------------

SceneMenu.prototype.saveScene = function () { // 保存场景
    var editor = this.app.editor;
    var sceneName = editor.sceneName;

    if (sceneName == null) {
        UI.prompt('保存场景', '名称', '新场景', (event, name) => {
            this.commitSave(name);
        });
    } else {
        this.commitSave(sceneName);
    }
};

SceneMenu.prototype.commitSave = function (sceneName) {
    var editor = this.app.editor;

    var obj = (new Converter()).toJSON({
        options: this.app.options,
        camera: editor.camera,
        renderer: editor.renderer,
        scripts: editor.scripts,
        animation: editor.animation,
        scene: editor.scene
    });

    Ajax.post(`${this.app.options.server}/api/Scene/Save`, {
        Name: sceneName,
        Data: JSON.stringify(obj)
    }, function (result) {
        var obj = JSON.parse(result);

        if (obj.Code === 200) {
            editor.sceneID = obj.ID;
            editor.sceneName = sceneName;
            document.title = sceneName;
        }

        UI.msg(obj.Msg);
    });
};

// --------------------------- 另存为场景 -------------------------------------

SceneMenu.prototype.saveAsScene = function () {
    var sceneName = this.app.editor.sceneName;

    if (sceneName == null) {
        sceneName = '新场景';
    }

    UI.prompt('保存场景', '名称', sceneName, (event, name) => {
        this.app.editor.sceneName = name;
        document.title = name;
        this.commitSaveAs(name);
    });
};

SceneMenu.prototype.commitSaveAs = function (sceneName) {
    var editor = this.app.editor;

    var obj = (new Converter()).toJSON({
        options: this.app.options,
        camera: editor.camera,
        renderer: editor.renderer,
        scripts: editor.scripts,
        animation: editor.animation,
        scene: editor.scene
    });

    Ajax.post(`${this.app.options.server}/api/Scene/Save`, {
        Name: sceneName,
        Data: JSON.stringify(obj)
    }, function (result) {
        var obj = JSON.parse(result);

        if (obj.Code === 200) {
            editor.sceneID = obj.ID;
            editor.sceneName = sceneName;
            document.title = sceneName;
        }

        UI.msg(obj.Msg);
    });
};

// ------------------------- 发布场景 ------------------------------

SceneMenu.prototype.publishScene = function () {
    var sceneID = this.app.editor.sceneID;

    if (!sceneID) {
        UI.msg('请先保存场景！');
        return;
    }

    UI.confirm('发布场景', '是否发布当前场景？', (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`${this.app.options.server}/api/Publish/Publish?ID=${sceneID}`, function (result) {
                var obj = JSON.parse(result);
                UI.msg(obj.Msg);
            });
        }
    });
};

// ------------------------ 本地打包发布 ---------------------------------------

// SceneMenu.prototype.publishSceneLocal = function () {
//     var editor = this.app.editor;

//     var zip = new JSZip();
//     //

//     var obj = (new Converter()).toJSON({
//         options: this.app.options,
//         camera: this.app.editor.camera,
//         renderer: this.app.editor.renderer,
//         scripts: this.app.editor.scripts,
//         scene: this.app.editor.scene
//     });

//     var output = JSON.stringify(obj);

//     zip.file('scene.json', output);

//     // 保存数据

//     var manager = new THREE.LoadingManager(() => {
//         this.savePublishScene(zip.generate({
//             type: 'blob'
//         }), `${editor.sceneName}.zip`);
//     });

//     var loader = new THREE.FileLoader(manager);
//     loader.load('index.html', content => {
//         zip.file('index.html', content);
//     });
//     loader.load('dist/ShadowEditor.js', function (content) {
//         zip.file('dist/ShadowEditor.js', content);
//     });
// };

// SceneMenu.prototype.savePublishScene = function (text, filename) {
//     var blob = new Blob([text], { type: 'text/plain' });

//     this.link.href = URL.createObjectURL(blob);
//     this.link.download = filename;
//     this.link.click();
// };

export default SceneMenu;