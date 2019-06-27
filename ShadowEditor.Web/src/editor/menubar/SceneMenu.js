import UI from '../../ui/UI';
import Converter from '../../serialization/Converter';
import Ajax from '../../utils/Ajax';
import GISScene from '../../gis/Scene';

/**
 * 场景菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SceneMenu(options) {
    UI.Control.call(this, options);
    app = options.app;
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
            html: L_SCENE
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                cls: 'option',
                style: {
                    cursor: 'default'
                },
                children: [{
                    xtype: 'div',
                    children: [{
                        xtype: 'html',
                        html: L_NEW
                    }, {
                        xtype: 'icon',
                        icon: 'icon-right-triangle',
                        style: {
                            float: 'right'
                        }
                    }]
                }, {
                    xtype: 'div',
                    cls: 'sub-menu',
                    children: [{
                        xtype: 'div',
                        cls: 'option',
                        html: L_EMPTY_SCENE,
                        onClick: this.createEmptyScene.bind(this),
                    }, {
                        xtype: 'div',
                        cls: 'option',
                        html: L_GIS_SCENE,
                        onClick: this.createGISScene.bind(this),
                    }]
                }],
            }, {
                xtype: 'div',
                html: L_SAVE,
                cls: 'option',
                onClick: this.saveScene.bind(this)
            }, {
                xtype: 'div',
                html: L_SAVE_AS,
                cls: 'option',
                onClick: this.saveAsScene.bind(this)
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                html: L_EXPORT_SCENE,
                cls: 'option',
                onClick: this.exportScene.bind(this)
            }]
        }]
    });

    container.render();
}

// ---------------------------- 新建空场景 ---------------------------------

SceneMenu.prototype.createEmptyScene = function () {
    var editor = app.editor;

    if (editor.sceneID == null) {
        editor.clear();
        editor.sceneID = null;
        editor.sceneName = null;
        document.title = L_NO_NAME;
        UI.msg(L_CREATE_EMPTY_SCENE_SUCCESS);
        return;
    }

    UI.confirm(L_CONFIRM, L_UNSAVED_WILL_LOSE_CONFIRM, (event, btn) => {
        if (btn === 'ok') {
            editor.clear();
            editor.sceneID = null;
            editor.sceneName = null;
            app.options.sceneType = 'Empty';
            document.title = L_NO_NAME;
            app.editor.camera.userData.control = 'OrbitControls';
        }
    });
};

// --------------------------- 新建GIS场景 -------------------------------------

SceneMenu.prototype.createGISScene = function () {
    if (app.editor.gis) {
        app.editor.gis.stop();
    }

    app.editor.gis = new GISScene(app);
    app.editor.gis.start();

    app.options.sceneType = 'GIS';

    app.editor.camera.userData.control = '';

    app.call(`sceneGraphChanged`, this);
};

// --------------------------- 保存场景 ----------------------------------------

SceneMenu.prototype.saveScene = function () { // 保存场景
    var editor = app.editor;
    var id = editor.sceneID;
    var sceneName = editor.sceneName;

    if (id) { // 编辑场景
        this.commitSave(id, sceneName);
    } else { // 新建场景
        UI.prompt(L_SAVE_SCENE, L_NAME, L_NEW_SCENE, (event, name) => {
            this.commitSave(id, name);
        });
    }
};

SceneMenu.prototype.commitSave = function (id, sceneName) {
    var editor = app.editor;

    // 记录选中物体，以便载入时还原场景选中
    var selected = app.editor.selected;
    if (selected) {
        app.options.selected = selected.uuid;
    }

    var obj = (new Converter()).toJSON({
        options: app.options,
        camera: editor.camera,
        renderer: editor.renderer,
        scripts: editor.scripts,
        animations: editor.animations,
        scene: editor.scene,
        visual: editor.visual,
    });

    var params = {
        Name: sceneName,
        Data: JSON.stringify(obj)
    };

    if (id) {
        params.ID = id;
    }

    Ajax.post(`${app.options.server}/api/Scene/Save`, params, result => {
        var obj = JSON.parse(result);

        if (obj.Code === 200) {
            editor.sceneID = obj.ID;
            editor.sceneName = sceneName;
            document.title = sceneName;
        }

        app.call(`sceneSaved`, this);

        UI.msg(obj.Msg);
    });
};

// --------------------------- 另存为场景 -------------------------------------

SceneMenu.prototype.saveAsScene = function () {
    var sceneName = app.editor.sceneName;

    if (sceneName == null) {
        sceneName = L_NEW_SCENE;
    }

    UI.prompt(L_SAVE_SCENE, L_NAME, sceneName, (event, name) => {
        app.editor.sceneName = name;
        document.title = name;
        this.commitSaveAs(name);
    });
};

SceneMenu.prototype.commitSaveAs = function (sceneName) {
    var editor = app.editor;

    var obj = (new Converter()).toJSON({
        options: app.options,
        camera: editor.camera,
        renderer: editor.renderer,
        scripts: editor.scripts,
        animations: editor.animations,
        scene: editor.scene,
        visual: editor.visual,
    });

    Ajax.post(`${app.options.server}/api/Scene/Save`, {
        Name: sceneName,
        Data: JSON.stringify(obj)
    }, result => {
        var obj = JSON.parse(result);

        if (obj.Code === 200) {
            editor.sceneID = obj.ID;
            editor.sceneName = sceneName;
            document.title = sceneName;
        }

        app.call(`sceneSaved`, this);

        UI.msg(obj.Msg);
    });
};

// -------------------------- 导出场景 --------------------------------

SceneMenu.prototype.exportScene = function () {
    var sceneID = app.editor.sceneID;

    if (!sceneID) {
        UI.msg('请先打开场景！');
        return;
    }

    UI.confirm('询问', '是否导出当前场景？', (event, btn) => {
        if (btn === 'ok') {
            fetch(`${app.options.server}/api/ExportScene/Run?ID=${sceneID}`, {
                method: 'POST'
            }).then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        UI.msg(json.Msg);
                        window.open(`${app.options.server}${json.Url}`, 'export');
                    });
                }
            });
        }
    });
};

export default SceneMenu;