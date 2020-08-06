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
import global from '../../global';

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
        global.app.require('TexGen').then(() => {
            const win = global.app.createElement(TextureGeneratorWindow);
            global.app.addElement(win);
        });
    }

    handleTypefaceManagement() {
        const win = global.app.createElement(TypefaceManagementWindow);
        global.app.addElement(win);
    }

    handleTypefaceConverter() {
        const win = global.app.createElement(TypefaceConverterWindow);
        global.app.addElement(win);
    }

    handleBackupDatabase() {
        global.app.mask(_t('Backing up, please wait.'));
        fetch(`${global.app.options.server}/api/BackupDatabase/Run`, {
            method: 'POST'
        }).then(response => {
            response.json().then(json => {
                global.app.unmask();
                if (json.Code === 300) {
                    global.app.toast(_t(json.Msg), 'error');
                }
                global.app.alert({
                    title: _t(json.Msg),
                    content: json.Path
                });
            });
        });
    }

    handleCleanUpScenes() {
        global.app.confirm({
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
                    global.app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                global.app.toast(_t(obj.Msg), 'success');
            });
        });
    }

    handlePlugins() {
        const win = global.app.createElement(PluginsWindow);
        global.app.addElement(win);
    }

    handleExportExamples() {
        global.app.confirm({
            title: _t('Query'),
            content: _t('Are you sure to export all the examples?'),
            onOK: () => {
                global.app.mask();
                fetch(`${global.app.options.server}/api/ExportExamples/Run`, {
                    method: 'POST'
                }).then(response => {
                    global.app.unmask();
                    if (response.ok) {
                        response.json().then(obj => {
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

export default ToolMenu;