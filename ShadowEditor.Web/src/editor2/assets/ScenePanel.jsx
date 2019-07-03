import './css/ScenePanel.css';

import { classNames, PropTypes, SearchField, ImageList } from '../../third_party';
import Ajax from '../../utils/Ajax';
import Converter from '../../serialization/Converter';
import GISScene from '../../gis/Scene';

/**
 * 场景面板
 * @author tengge / https://github.com/tengge1
 */
class ScenePanel extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.data = [];

        this.state = {
            data: [],
            categoryData: [],
        };
    }

    render() {
        const { data, categoryData } = this.state;

        const imageListData = data.map(n => {
            return {
                id: n.ID,
                src: n.Thumbnail ? n.Thumbnail : null,
                title: n.Name,
                icon: 'scenes',
                cornerText: `v${n.Version}`,
            };
        });

        return <div className={'ScenePanel'}>
            <SearchField
                data={categoryData}
                placeholder={L_SEARCH_CONTENT}
                addHidden={true}
                onInput={this.handleSearch.bind(this)}></SearchField>
            <ImageList
                data={imageListData}
                onClick={this.handleClick}
                onEdit={this.handleEdit}
                onDelete={this.handleDelete}></ImageList>
        </div>;
    }

    componentDidMount() {
        fetch(`/api/Category/List?type=Scene`).then(response => {
            response.json().then(obj => {
                this.setState({
                    categoryData: obj.Data,
                });
            });
        });
        fetch(`/api/Scene/List`).then(response => {
            response.json().then(obj => {
                this.data = obj.Data;
                this.setState({
                    data: this.data,
                });
            });
        });
    }

    handleSearch(name, categories, event) {
        var list = this.data;

        if (name.trim() !== '') {
            name = name.toLowerCase();

            list = list.filter(n => {
                return n.Name.indexOf(name) > -1 ||
                    n.FirstPinYin.indexOf(name) > -1 ||
                    n.TotalPinYin.indexOf(name) > -1;
            });
        }

        if (categories.length > 0) {
            list = list.filter(n => {
                return categories.indexOf(n.CategoryID) > -1;
            });
        }

        this.setState({
            data: list,
        });
    }

    handleClick(data) {
        var editor = app.editor;
        var server = app.options.server;
        document.title = data.Name;

        Ajax.get(`${server}/api/Scene/Load?ID=${data.id}`, (json) => {
            var obj = JSON.parse(json);

            editor.clear(false);

            (new Converter()).fromJson(obj.Data, {
                server: app.options.server,
                camera: app.editor.camera
            }).then(obj => {
                this.onLoadScene(obj);

                editor.sceneID = data.id;
                editor.sceneName = data.title;
                document.title = data.title;

                if (obj.options) {
                    app.call('optionsChanged', this, app.options);

                    if (obj.options.sceneType === 'GIS') {
                        if (app.editor.gis) {
                            app.editor.gis.stop();
                        }
                        app.editor.gis = new GISScene(app, {
                            useCameraPosition: true,
                        });
                        app.editor.gis.start();
                    }
                }

                if (obj.scripts) {
                    app.call('scriptChanged', this);
                }

                if (obj.scene) {
                    app.call('sceneGraphChanged', this);
                }

                // UI.msg(L_LOAD_SUCCESS);
            });
        });
    }

    onLoadScene(obj) {
        if (obj.options) {
            Object.assign(app.options, obj.options);
        }

        if (obj.camera) {
            app.editor.camera.copy(obj.camera);

            app.editor.camera.children.forEach(n => {
                if (n instanceof THREE.AudioListener) {
                    app.editor.camera.remove(n);
                }
            });

            var audioListener = obj.camera.children.filter(n => n instanceof THREE.AudioListener)[0];
            if (audioListener) {
                app.editor.audioListener = audioListener;
                app.editor.camera.add(audioListener);
            }
        }

        if (obj.renderer) {
            var viewport = app.viewport;
            var oldRenderer = app.editor.renderer;

            viewport.removeChild(oldRenderer.domElement);
            viewport.appendChild(obj.renderer.domElement);
            app.editor.renderer = obj.renderer;
            app.editor.renderer.setSize(viewport.offsetWidth, viewport.offsetHeight);
            app.call('resize', this);
        }

        if (obj.scripts) {
            Object.assign(app.editor.scripts, obj.scripts);
        }

        if (obj.animations) {
            Object.assign(app.editor.animations, obj.animations);
        } else {
            app.editor.animations = [{
                id: null,
                uuid: THREE.Math.generateUUID(),
                layer: 0,
                layerName: L_ANIMATION_LAYER_1,
                animations: []
            }, {
                id: null,
                uuid: THREE.Math.generateUUID(),
                layer: 1,
                layerName: L_ANIMATION_LAYER_2,
                animations: []
            }, {
                id: null,
                uuid: THREE.Math.generateUUID(),
                layer: 2,
                layerName: L_ANIMATION_LAYER_3,
                animations: []
            }];
        }

        if (obj.scene) {
            app.editor.setScene(obj.scene);
        }

        app.editor.camera.updateProjectionMatrix();

        if (obj.options.selected) {
            var selected = app.editor.objectByUuid(obj.options.selected);
            if (selected) {
                app.editor.select(selected);
            }
        }

        // 可视化
        if (obj.visual) {
            app.editor.visual.fromJSON(obj.visual);
        } else {
            // app.editor.visual.clear();
        }
        // app.editor.visual.render(app.editor.svg);

        app.call('sceneLoaded', this);
        app.call('animationChanged', this);
    }

    // ------------------------------- 编辑场景 ---------------------------------------

    handleEdit(data) {
        if (this.editWindow === undefined) {
            this.editWindow = new EditWindow({
                app: app,
                parent: document.body,
                type: 'Scene',
                typeName: L_SCENE,
                saveUrl: `${app.options.server}/api/Scene/Edit`,
                callback: this.updateList.bind(this)
            });
            this.editWindow.render();
        }
        this.editWindow.setData(data);
        this.editWindow.show();
    }

    // ------------------------------ 删除场景 ----------------------------------------

    handleDelete(data) {
        var server = app.options.server;

        UI.confirm(L_CONFIRM, `${L_DELETE} ${data.Name}?`, (event, btn) => {
            if (btn === 'ok') {
                Ajax.post(`${server}/api/Scene/Delete?ID=${data.ID}`, json => {
                    var obj = JSON.parse(json);
                    if (obj.Code === 200) {
                        this.update();
                    }
                    UI.msg(obj.Msg);
                });
            }
        });
    }
}

export default ScenePanel;