/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import {MenuItem, MenuItemSeparator} from '../../ui/index';
import Converter from '../../serialization/Converter';
import Ajax from '../../utils/Ajax';
import TimeUtils from '../../utils/TimeUtils';
import StringUtils from '../../utils/StringUtils';
import SaveSceneWindow from './window/SaveSceneWindow.jsx';
import EmptySceneTemplate from './scene/EmptySceneTemplate';
// import DistrictSceneTemplate from './scene/DistrictSceneTemplate';
// import GISSceneTemplate from './scene/GISSceneTemplate';
import global from '../../global';

/**
 * 场景菜单
 * @author tengge / https://github.com/tengge1
 */
class SceneMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleCreateEmptyScene = this.handleCreateEmptyScene.bind(this);
        this.handleCreateDistrictAndIndoor = this.handleCreateDistrictAndIndoor.bind(this);
        this.handleSaveScene = this.handleSaveScene.bind(this);
        this.handleSaveAsScene = this.handleSaveAsScene.bind(this);

        this.handleExportSceneToJson = this.handleExportSceneToJson.bind(this);
        this.handleExportSceneToCollada = this.handleExportSceneToCollada.bind(this);
        this.handleExportSceneToGltf = this.handleExportSceneToGltf.bind(this);
        this.handleExportSceneToOBJ = this.handleExportSceneToOBJ.bind(this);
        this.handleExportSceneToPLY = this.handleExportSceneToPLY.bind(this);
        this.handleExportSceneToSTL = this.handleExportSceneToSTL.bind(this);

        this.handlePublishScene = this.handlePublishScene.bind(this);
    }

    render() {
        const {enableAuthority, isLogin, authorities} = global.app.server;

        return <MenuItem title={_t('Scene')}>
            {!enableAuthority || isLogin ? <MenuItem title={_t('New')}>
                <MenuItem title={_t('Empty Scene')}
                          onClick={this.handleCreateEmptyScene}
                />
                <MenuItem title={_t('District (Test)')}
                          onClick={this.handleCreateDistrictAndIndoor}
                />
            </MenuItem> : null}
            {!enableAuthority || authorities.includes('SAVE_SCENE') ? <MenuItem title={_t('Save')}
                                                                                onClick={this.handleSaveScene}
            /> : null}
            {!enableAuthority || authorities.includes('SAVE_SCENE') ? <MenuItem title={_t('Save As')}
                                                                                onClick={this.handleSaveAsScene}
            /> : null}
            {!enableAuthority || authorities.includes('SAVE_SCENE') ? <MenuItemSeparator/> : null}
            {!enableAuthority || isLogin ? <MenuItem title={_t('Export Scene')}>
                <MenuItem title={_t('To JSON File')}
                          onClick={this.handleExportSceneToJson}
                />
                <MenuItem title={_t('To Collada File')}
                          onClick={this.handleExportSceneToCollada}
                />
                <MenuItem title={_t('To GLTF File')}
                          onClick={this.handleExportSceneToGltf}
                />
                <MenuItem title={_t('To OBJ File')}
                          onClick={this.handleExportSceneToOBJ}
                />
                <MenuItem title={_t('To PLY File')}
                          onClick={this.handleExportSceneToPLY}
                />
                <MenuItem title={_t('To STL File')}
                          onClick={this.handleExportSceneToSTL}
                />
            </MenuItem> : null}
            {!enableAuthority || authorities.includes('PUBLISH_SCENE') ? <MenuItem title={_t('Publish Scene')}
                                                                                   onClick={this.handlePublishScene}
            /> : null}
        </MenuItem>;
    }

    componentDidMount() {
        if (global.app.debug) {
            // TODO: just for gis development, and remove this afterwards.
            global.app.on(`appStarted.dev-3d-gis`, () => {
                setTimeout(() => {
                    this.handleCreateGISScene();
                });
            });
        }
    }

    /**
     * 创建场景前询问
     * @returns {Promise} 是否创建成功
     */
    queryBeforeCreateScene() {
        const editor = global.app.editor;

        return new Promise(resolve => {
            if (editor.sceneID === null) {
                resolve();
            } else {
                global.app.confirm({
                    title: _t('Confirm'),
                    content: _t('All unsaved data will be lost. Are you sure?'),
                    onOK: () => {
                        resolve();
                    }
                });
            }
        });
    }

    /**
     * 新建空场景
     */
    handleCreateEmptyScene() {
        this.queryBeforeCreateScene().then(() => {
            const scene = new EmptySceneTemplate();
            scene.clear();
            scene.create();
            global.app.call('editorCleared', this);
            global.app.call('scriptChanged', this);
            global.app.call('animationChanged', this);
            global.app.toast(_t('Create empty scene successfully.'), 'success');
        });
    }

    /**
     * 新建小区和室内
     */
    handleCreateDistrictAndIndoor() {
        let editor = global.app.editor;

        this.queryBeforeCreateScene().then(() => {
            editor.clear();
            editor.sceneID = null;
            editor.sceneName = null;
            global.app.options.sceneType = 'Empty';
            document.title = _t('District and Indoor');
            global.app.editor.camera.userData.control = 'OrbitControls';

            // 添加地面
            let geometry = new THREE.PlaneBufferGeometry(100, 100);

            let map = new THREE.TextureLoader().load('assets/textures/grid.png');
            map.wrapS = map.wrapT = THREE.RepeatWrapping;
            map.repeat.set(64, 64);

            let material = new THREE.MeshBasicMaterial({
                map
            });

            let mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = -Math.PI / 2;
            mesh.name = _t('Ground');

            global.app.editor.addObject(mesh);

            global.app.toast(_t('Create district successfully.'), 'success');
        });
    }

    // --------------------------- 保存场景 ----------------------------------------

    handleSaveScene() { // 保存场景
        var editor = global.app.editor;
        var id = editor.sceneID;
        var sceneName = editor.sceneName;

        if (id) { // 编辑场景
            this.commitSave(id, sceneName);
        } else { // 新建场景
            const win = global.app.createElement(SaveSceneWindow);
            global.app.addElement(win);
        }
    }

    commitSave(id, sceneName) {
        var editor = global.app.editor;

        // 记录选中物体，以便载入时还原场景选中
        var selected = global.app.editor.selected;
        if (selected) {
            global.app.options.selected = selected.uuid;
        }

        global.app.mask(_t('Waiting...'));

        var obj = new Converter().toJSON({
            options: global.app.options,
            camera: editor.camera,
            renderer: editor.renderer,
            scripts: editor.scripts,
            animations: editor.animations,
            scene: editor.scene,
            visual: editor.visual
        });

        var params = {
            Name: sceneName,
            Data: JSON.stringify(obj)
        };

        if (id) {
            params.ID = id;
        }

        Ajax.post(`${global.app.options.server}/api/Scene/Save`, params, result => {
            var obj = JSON.parse(result);

            global.app.unmask();

            if (obj.Code === 200) {
                editor.sceneID = obj.ID;
                editor.sceneName = sceneName;
                document.title = sceneName;

                global.app.call(`sceneSaved`, this);
                global.app.toast(_t(obj.Msg), 'success');
            } else {
                global.app.toast(_t(obj.Msg), 'warn');
            }
        });
    }

    // --------------------------- 另存为场景 -------------------------------------

    handleSaveAsScene() {
        const win = global.app.createElement(SaveSceneWindow);
        global.app.addElement(win);
    }

    // ---------------------- 导出场景为json文件 --------------------------

    querySceneName() {
        var sceneName = global.app.editor.sceneName;

        if (!sceneName) {
            sceneName = _t(`Scene{{Time}}`, {Time: TimeUtils.getDateTime()});
        }

        return new Promise(resolve => {
            global.app.prompt({
                title: _t('Input File Name'),
                content: _t('Name'),
                value: sceneName,
                onOK: name => {
                    resolve(name);
                }
            });
        });
    }

    handleExportSceneToJson() {
        this.querySceneName().then(name => {
            var output = global.app.editor.scene.toJSON();

            try {
                output = JSON.stringify(output, StringUtils.parseNumber, '\t');
                // eslint-disable-next-line
                output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
            } catch (e) {
                output = JSON.stringify(output);
            }

            StringUtils.saveString(output, `${name}.json`);
        });
    }

    // ----------------------- 导出场景为Collada文件 ----------------------

    handleExportSceneToCollada() {
        this.querySceneName().then(name => {
            global.app.require('ColladaExporter').then(() => {
                var exporter = new THREE.ColladaExporter();

                exporter.parse(global.app.editor.scene, function (result) {
                    StringUtils.saveString(result.data, `${name}.dae`);
                });
            });
        });
    }

    // ----------------------- 导出场景为gltf文件 -------------------------

    handleExportSceneToGltf() {
        this.querySceneName().then(name => {
            global.app.require('GLTFExporter').then(() => {
                var exporter = new THREE.GLTFExporter();

                exporter.parse(global.app.editor.scene, result => {
                    StringUtils.saveString(JSON.stringify(result), `${name}.gltf`);
                });
            });
        });
    }

    // ---------------------- 导出场景为OBJ文件 -------------------------------

    handleExportSceneToOBJ() {
        this.querySceneName().then(name => {
            global.app.require('OBJExporter').then(() => {
                var exporter = new THREE.OBJExporter();
                StringUtils.saveString(exporter.parse(global.app.editor.scene), `${name}.obj`);
            });
        });
    }

    // ----------------------- 导出场景为PLY文件 ---------------------------------

    handleExportSceneToPLY() {
        this.querySceneName().then(name => {
            global.app.require('PLYExporter').then(() => {
                var exporter = new THREE.PLYExporter();
                StringUtils.saveString(exporter.parse(global.app.editor.scene, {
                    excludeAttributes: ['normal', 'uv', 'color', 'index']
                }), `${name}.ply`);
            });
        });
    }

    // ------------------------ 导出场景为STL文件 --------------------------------

    handleExportSceneToSTL() {
        this.querySceneName().then(name => {
            global.app.require('STLExporter').then(() => {
                var exporter = new THREE.STLExporter();
                StringUtils.saveString(exporter.parse(global.app.editor.scene), `${name}.stl`);
            });
        });
    }

    // -------------------------- 发布场景 --------------------------------

    handlePublishScene() {
        var sceneID = global.app.editor.sceneID;

        if (!sceneID) {
            global.app.toast(_t('Please open scene first.'), 'warn');
            return;
        }

        global.app.confirm({
            title: _t('Query'),
            content: _t('Are you sure to publish the current scene?'),
            onOK: () => {
                global.app.mask(_t('Publishing...'));

                fetch(`${global.app.options.server}/api/ExportScene/Run?ID=${sceneID}`, {
                    method: 'POST'
                }).then(response => {
                    if (response.ok) {
                        response.json().then(obj => {
                            global.app.unmask();
                            if (obj.Code !== 200) {
                                global.app.toast(_t(obj.Msg), 'warn');
                                return;
                            }
                            global.app.toast(_t(obj.Msg), 'success');
                            window.open(`${global.app.options.server}${obj.Url}`, 'export');
                        });
                    }
                });
            }
        });
    }
}

export default SceneMenu;