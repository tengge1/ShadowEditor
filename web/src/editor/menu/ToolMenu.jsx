/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { MenuItem, MenuItemSeparator } from '../../ui/index';
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