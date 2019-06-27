import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 场景菜单
 * @author tengge / https://github.com/tengge1
 */
class SceneMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleCreateEmptyScene = this.handleCreateEmptyScene.bind(this);
        this.handleCreateGISScene = this.handleCreateGISScene.bind(this);
        this.handleSaveScene = this.handleSaveScene.bind(this);
        this.handleSaveAsScene = this.handleSaveAsScene.bind(this);
        this.handleExportScene = this.handleExportScene.bind(this);
    }

    render() {
        return <MenuItem title={L_SCENE}>
            <MenuItem title={L_NEW}>
                <MenuItem title={L_EMPTY_SCENE} onClick={this.handleCreateEmptyScene}></MenuItem>
                <MenuItem title={L_GIS_SCENE} onClick={this.handleCreateGISScene}></MenuItem>
            </MenuItem>
            <MenuItem title={L_SAVE} onClick={this.handleSaveScene}></MenuItem>
            <MenuItem title={L_SAVE_AS} onClick={this.handleSaveAsScene}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_EXPORT_SCENE} onClick={this.handleExportScene}></MenuItem>
        </MenuItem>;
    }

    // ---------------------------- 新建空场景 ---------------------------------

    handleCreateEmptyScene() {
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
    }

    // --------------------------- 新建GIS场景 -------------------------------------

    handleCreateGISScene() {
        if (app.editor.gis) {
            app.editor.gis.stop();
        }

        app.editor.gis = new GISScene(app);
        app.editor.gis.start();

        app.options.sceneType = 'GIS';

        app.editor.camera.userData.control = '';

        app.call(`sceneGraphChanged`, this);
    }

    // --------------------------- 保存场景 ----------------------------------------

    handleSaveScene() { // 保存场景
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
    }

    commitSave(id, sceneName) {
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
    }

    // --------------------------- 另存为场景 -------------------------------------

    handleSaveAsScene() {
        var sceneName = app.editor.sceneName;

        if (sceneName == null) {
            sceneName = L_NEW_SCENE;
        }

        UI.prompt(L_SAVE_SCENE, L_NAME, sceneName, (event, name) => {
            app.editor.sceneName = name;
            document.title = name;
            this.commitSaveAs(name);
        });
    }

    commitSaveAs(sceneName) {
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
    }

    // -------------------------- 导出场景 --------------------------------

    handleExportScene() {
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
    }
}

export default SceneMenu;