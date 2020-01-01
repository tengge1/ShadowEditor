import { MenuItem, MenuItemSeparator } from '../../third_party';
import TextureGeneratorWindow from './window/TextureGeneratorWindow.jsx';
import TypefaceManagementWindow from './window/TypefaceManagementWindow.jsx';
import TypefaceConverterWindow from './window/TypefaceConverterWindow.jsx';
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
        this.handleTypefaceManagement = this.handleTypefaceManagement.bind(this);
        this.handleTypefaceConverter = this.handleTypefaceConverter.bind(this);
        this.handleBackupDatabase = this.handleBackupDatabase.bind(this);
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
            <MenuItem title={_t('Typeface Management')}
                onClick={this.handleTypefaceManagement}
            />
            <MenuItem title={_t('Typeface Converter')}
                onClick={this.handleTypefaceConverter}
            />
            <MenuItemSeparator />
            <MenuItem title={_t('Backup Database')}
                onClick={this.handleBackupDatabase}
            />
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

    handleTypefaceManagement() {
        const win = app.createElement(TypefaceManagementWindow);
        app.addElement(win);
    }

    handleTypefaceConverter() {
        const win = app.createElement(TypefaceConverterWindow);
        app.addElement(win);
    }

    handleBackupDatabase() {
        app.mask(_t('Backing up, please wait.'));
        fetch(`${app.options.server}/api/BackupDatabase/Run`, {
            method: 'POST'
        }).then(response => {
            response.json().then(json => {
                app.unmask();
                if (json.Code === 300) {
                    app.toast(_t(json.Msg), 'error');
                }
                app.alert({
                    title: _t(json.Msg),
                    content: json.Path
                });
            });
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
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                app.toast(_t(obj.Msg), 'success');
            });
        });
    }

    handlePlugins() {
        const win = app.createElement(PluginsWindow);
        app.addElement(win);
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
                                app.toast(_t(obj.Msg), 'warn');
                                return;
                            }
                            app.toast(_t(obj.Msg), 'success');
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
                                app.toast(_t(obj.Msg), 'warn');
                                return;
                            }
                            app.toast(_t(obj.Msg), 'success');
                            window.open(`${app.options.server}${obj.Url}`, 'export');
                        });
                    }
                });
            }
        });
    }
}

export default ToolMenu;