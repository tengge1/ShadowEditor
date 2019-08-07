import { classNames, PropTypes, SearchField, ImageList } from '../../third_party';
import EditWindow from './window/EditWindow.jsx';
import Converter from '../../serialization/Converter';
import GISScene from '../../gis/Scene';

/**
 * 场景面板
 * @author tengge / https://github.com/tengge1
 */
class ScenePanel extends React.Component {
    constructor(props) {
        super(props);

        this.data = [];

        this.state = {
            data: [],
            categoryData: [],
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.update = this.update.bind(this);
    }

    render() {
        const { className, style } = this.props;
        const { data, categoryData } = this.state;

        const imageListData = data.map(n => {
            return Object.assign({}, n, {
                id: n.ID,
                src: n.Thumbnail ? n.Thumbnail : null,
                title: n.Name,
                icon: 'scenes',
                cornerText: `v${n.Version}`,
            });
        });

        return <div className={classNames('ScenePanel', className)} style={style}>
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

    componentDidUpdate(prevProps, prevState) {
        if (this.init === undefined && this.props.show === true) {
            this.init = true;
            this.update();
            app.on(`sceneSaved.${this.id}`, this.update);
        }
    }

    update() {
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

        app.mask(L_LOADING);

        fetch(`${server}/api/Scene/Load?ID=${data.id}`).then(response => {
            response.json().then(obj => {
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

                    app.unmask();

                    app.toast(L_LOAD_SUCCESS);
                });
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
        // if (obj.visual) {
        //     app.editor.visual.fromJSON(obj.visual);
        // } else {
        // app.editor.visual.clear();
        // }
        // app.editor.visual.render(app.editor.svg);

        app.call('sceneLoaded', this);
        app.call('animationChanged', this);
    }

    // ------------------------------- 编辑 ---------------------------------------

    handleEdit(data) {
        var win = app.createElement(EditWindow, {
            type: 'Scene',
            typeName: L_SCENE,
            data,
            saveUrl: `${app.options.server}/api/Scene/Edit`,
            callback: this.update,
        });

        app.addElement(win);
    }

    // ------------------------------ 删除 ----------------------------------------

    handleDelete(data) {
        var server = app.options.server;

        app.confirm({
            title: L_CONFIRM,
            content: `${L_DELETE} ${data.title}?`,
            onOK: () => {
                fetch(`${server}/api/Scene/Delete?ID=${data.id}`, {
                    method: 'POST',
                }).then(response => {
                    response.json().then(obj => {
                        if (obj.Code === 200) {
                            this.update();
                        }
                        app.toast(obj.Msg);
                    });
                });
            }
        });
    }
}

ScenePanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool,
};

ScenePanel.defaultProps = {
    className: null,
    style: null,
    show: false,
};

export default ScenePanel;