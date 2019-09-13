import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';
import TextureGeneratorWindow from './window/TextureGeneratorWindow.jsx';
// import CleanUpScenesWindow from './window/CleanUpScenesWindow.jsx';

/**
 * 工具菜单
 * @author tengge / https://github.com/tengge1
 */
class ToolMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleTextureGenerator = this.handleTextureGenerator.bind(this);
        this.handleArrangeMap = this.handleArrangeMap.bind(this);
        this.handleArrangeMesh = this.handleArrangeMesh.bind(this);
        this.handleArrangeThumbnail = this.handleArrangeThumbnail.bind(this);
        this.handleCleanUpScenes = this.handleCleanUpScenes.bind(this);
        this.commitCleanUpScenes = this.commitCleanUpScenes.bind(this)
        this.handleExportEditor = this.handleExportEditor.bind(this);
        this.handleExportExamples = this.handleExportExamples.bind(this);
    }

    render() {
        return <MenuItem title={_t('Tool')}>
            <MenuItem title={_t('Texture Generator')} onClick={this.handleTextureGenerator}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={_t('Arrange Map')} show={app.debug === true} onClick={this.handleArrangeMap}></MenuItem>
            <MenuItem title={_t('Arrange Mesh')} show={app.debug === true} onClick={this.handleArrangeMesh}></MenuItem>
            <MenuItem title={_t('Arrange Thumbnail')} show={app.debug === true} onClick={this.handleArrangeThumbnail}></MenuItem>
            <MenuItem title={_t('Clean Up Scenes')} onClick={this.handleCleanUpScenes}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={_t('Export Editor')} onClick={this.handleExportEditor}></MenuItem>
            <MenuItem title={_t('Export Examples')} onClick={this.handleExportExamples}></MenuItem>
        </MenuItem>;
    }

    handleTextureGenerator() {
        app.require('TexGen').then(() => {
            const win = app.createElement(TextureGeneratorWindow);
            app.addElement(win);
        });
    }

    handleArrangeMap() {
        app.confirm({
            title: _t('Query'),
            content: _t('Organizing the texture will remove the number and underscore after the name, regenerate the data table and texture catalog, remove the empty folder and unreferenced texture file, the system will automatically back up the data table and texture catalog, is it organized?'),
            onOK: () => {
                fetch(`${app.options.server}/api/ArrangeMap/Run`, {
                    method: 'POST'
                }).then(response => {
                    if (response.ok) {
                        response.json().then(json => {
                            app.toast(_t(json.Msg));
                        });
                    }
                });
            }
        });
    }

    handleArrangeMesh() {
        app.confirm({
            title: _t('Query'),
            content: _t('Organizing the model will remove the number and underscore after the name, regenerate the data table, model catalog, remove empty folders and unreferenced model files, the system will automatically back up the data table, model catalog, whether to sort?'),
            onOK: () => {
                fetch(`${app.options.server}/api/ArrangeMesh/Run`, {
                    method: 'POST'
                }).then(response => {
                    if (response.ok) {
                        response.json().then(json => {
                            app.toast(_t(json.Msg));
                        });
                    }
                });
            }
        });
    }

    handleArrangeThumbnail() {
        app.confirm({
            title: _t('Query'),
            content: _t('Organizing the thumbnails will regenerate the thumbnail directory, modify the scene, model, texture, material, audio, animation, particles, preset body, and the thumbnail path of the characters. Please manually back up the database first.'),
            onOK: () => {
                fetch(`${app.options.server}/api/ArrangeThumbnail/Run`, {
                    method: 'POST'
                }).then(response => {
                    if (response.ok) {
                        response.json().then(json => {
                            app.toast(_t(json.Msg));
                        });
                    }
                });
            }
        });
    }

    handleCleanUpScenes() {
        app.confirm({
            title: _t('Clean Up Scenes'),
            content: _t('Are you sure to clean up all the deleted scenes and scene histories?'),
            onOK: this.commitCleanUpScenes
        });
    }

    commitCleanUpScenes() {
        fetch(`/api/CleanUpScenes/Run`, {
            method: 'POST',
        }).then(response => {
            response.json().then(json => {
                app.toast(_t(json.Msg));
            });
        });
    }

    handleExportEditor() {
        app.confirm({
            title: _t('Query'),
            content: _t('Are you sure to export the editor?'),
            onOK: () => {
                fetch(`${app.options.server}/api/ExportEditor/Run`, {
                    method: 'POST'
                }).then(response => {
                    if (response.ok) {
                        response.json().then(json => {
                            app.toast(_t(json.Msg));
                            window.open(`${app.options.server}${json.Url}`, 'export');
                        });
                    }
                });
            }
        });
    }

    handleExportExamples() {
        app.confirm({
            title: _t('Query'),
            content: _t('Are you sure to export all the examples?'),
            onOK: () => {
                fetch(`${app.options.server}/api/ExportExamples/Run`, {
                    method: 'POST'
                }).then(response => {
                    if (response.ok) {
                        response.json().then(json => {
                            app.toast(_t(json.Msg));
                            // window.open(`${app.options.server}${json.Url}`, 'export');
                        });
                    }
                });
            }
        });
    }
}

export default ToolMenu;