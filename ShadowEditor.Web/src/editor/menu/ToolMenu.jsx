import { MenuItem, MenuItemSeparator } from '../../third_party';
import TextureGeneratorWindow from './window/TextureGeneratorWindow.jsx';
// import CleanUpScenesWindow from './window/CleanUpScenesWindow.jsx';
import PluginsWindow from './window/PluginsWindow.jsx';

/**
 * 工具菜单
 * @author tengge / https://github.com/tengge1
 */
class ToolMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleTextureGenerator = this.handleTextureGenerator.bind(this);
        this.handleCleanUpScenes = this.handleCleanUpScenes.bind(this);
        this.commitCleanUpScenes = this.commitCleanUpScenes.bind(this);
        this.handlePlugins = this.handlePlugins.bind(this);
        this.handleExportEditor = this.handleExportEditor.bind(this);
        this.handleExportExamples = this.handleExportExamples.bind(this);
    }

    render() {
        return <MenuItem title={_t('Tool')}>
            <MenuItem title={_t('Texture Generator')}
                onClick={this.handleTextureGenerator}
            />
            <MenuItemSeparator />
            <MenuItem title={_t('Clean Up Scenes')}
                onClick={this.handleCleanUpScenes}
            />
            <MenuItemSeparator />
            <MenuItem title={_t('Plugins')}
                onClick={this.handlePlugins}
            />
            <MenuItem title={_t('Export Editor')}
                onClick={this.handleExportEditor}
            />
            <MenuItem title={_t('Export Examples')}
                onClick={this.handleExportExamples}
            />
        </MenuItem>;
    }

    handleTextureGenerator() {
        app.require('TexGen').then(() => {
            const win = app.createElement(TextureGeneratorWindow);
            app.addElement(win);
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
            method: 'POST'
        }).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg));
                    return;
                }
                app.toast(_t(obj.Msg));
            });
        });
    }

    handlePlugins() {
        debugger;
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
                        response.json().then(obj => {
                            if (obj.Code !== 200) {
                                app.toast(_t(obj.Msg));
                                return;
                            }
                            app.toast(_t(obj.Msg));
                            window.open(`${app.options.server}${obj.Url}`, 'export');
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
                app.mask();
                fetch(`${app.options.server}/api/ExportExamples/Run`, {
                    method: 'POST'
                }).then(response => {
                    app.unmask();
                    if (response.ok) {
                        response.json().then(obj => {
                            if (obj.Code !== 200) {
                                app.toast(_t(obj.Msg));
                                return;
                            }
                            app.toast(_t(obj.Msg));
                            window.open(`${app.options.server}${obj.Url}`, 'export');
                        });
                    }
                });
            }
        });
    }
}

export default ToolMenu;