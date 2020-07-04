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
import OptionsWindow from './window/OptionsWindow.jsx';

/**
 * 选项菜单
 * @author tengge / https://github.com/tengge1
 */
class OptionsMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleDisplayOptions = this.handleDisplayOptions.bind(this);
        this.handleRendererOptions = this.handleRendererOptions.bind(this);
        this.handleHelperOptions = this.handleHelperOptions.bind(this);
        this.handleFilterOptions = this.handleFilterOptions.bind(this);
        this.handleWeatherOptions = this.handleWeatherOptions.bind(this);

        this.handleChangeControlMode = this.handleChangeControlMode.bind(this);
        this.handleChangeSelectMode = this.handleChangeSelectMode.bind(this);
        this.handleChangeAddMode = this.handleChangeAddMode.bind(this);

        this.handleChangeEnglish = this.handleChangeEnglish.bind(this);
        this.handleChangeChinese = this.handleChangeChinese.bind(this);

        this.handleEnableDebugMode = this.handleEnableDebugMode.bind(this);
        this.handleDisableDebugMode = this.handleDisableDebugMode.bind(this);
    }

    render() {
        const isLogin = !app.server.enableAuthority || app.server.isLogin;

        const controlMode = app.storage.controlMode;
        const selectMode = app.storage.selectMode;
        const addMode = app.storage.addMode;

        const lang = window.localStorage.getItem('lang');

        return <MenuItem title={_t('Options')}>
            <MenuItem title={_t('Display')}
                onClick={this.handleDisplayOptions}
            />
            <MenuItem title={_t('Renderer')}
                onClick={this.handleRendererOptions}
            />
            <MenuItem title={_t('Helpers')}
                onClick={this.handleHelperOptions}
            />
            <MenuItem title={_t('Filter')}
                onClick={this.handleFilterOptions}
            />
            <MenuItem title={_t('Weather')}
                onClick={this.handleWeatherOptions}
            />
            <MenuItemSeparator />
            {isLogin && <MenuItem title={_t('Control Mode')}>
                <MenuItem name={'EditorControls'}
                    title={_t('Editor Controls')}
                    selected={controlMode === 'EditorControls'}
                    onClick={this.handleChangeControlMode}
                />
                <MenuItem name={'FreeControls'}
                    title={_t('Free Controls')}
                    selected={controlMode === 'FreeControls'}
                    onClick={this.handleChangeControlMode}
                />
            </MenuItem>}
            {isLogin && <MenuItem title={_t('Select Mode')}>
                <MenuItem name={'whole'}
                    title={_t('Select Whole')}
                    selected={selectMode === 'whole'}
                    onClick={this.handleChangeSelectMode}
                />
                <MenuItem name={'part'}
                    title={_t('Select Part')}
                    selected={selectMode === 'part'}
                    onClick={this.handleChangeSelectMode}
                />
            </MenuItem>}
            {isLogin && <MenuItem title={_t('Add Mode')}>
                <MenuItem name={'center'}
                    title={_t('Add To Center')}
                    selected={addMode === 'center'}
                    onClick={this.handleChangeAddMode}
                />
                <MenuItem name={'click'}
                    title={_t('Click Scene To Add')}
                    selected={addMode === 'click'}
                    onClick={this.handleChangeAddMode}
                />
            </MenuItem>}
            <MenuItemSeparator />
            <MenuItem title={_t('Language')}>
                <MenuItem title={'English'}
                    selected={lang === 'en-US'}
                    onClick={this.handleChangeEnglish}
                />
                <MenuItem title={'简体中文'}
                    selected={lang === 'zh-CN'}
                    onClick={this.handleChangeChinese}
                />
                <MenuItem title={'繁體中文'}
                    selected={lang === 'zh-TW'}
                    onClick={this.handleChangeTraditionalChinese}
                />
                <MenuItem title={'日本語'}
                    selected={lang === 'ja-JP'}
                    onClick={this.handleChangeJapanese}
                />
                <MenuItem title={'한국어'}
                    selected={lang === 'ko-KR'}
                    onClick={this.handleChangeKorean}
                />
                <MenuItem title={'русский'}
                    selected={lang === 'ru-RU'}
                    onClick={this.handleChangeRussian}
                />
                <MenuItem title={'Le français'}
                    selected={lang === 'fr-FR'}
                    onClick={this.handleChangeFrench}
                />
            </MenuItem>
            {isLogin && <MenuItem title={_t('Debug Mode')}>
                <MenuItem title={_t('Enable')}
                    selected={app.debug}
                    onClick={this.handleEnableDebugMode}
                />
                <MenuItem title={_t('Disable')}
                    selected={!app.debug}
                    onClick={this.handleDisableDebugMode}
                />
            </MenuItem>}
        </MenuItem>;
    }

    // ---------------------------------- 显示选项 ---------------------------------------

    handleDisplayOptions() {
        let win = app.createElement(OptionsWindow, {
            activeTabIndex: 0
        });
        app.addElement(win);
    }

    // ---------------------------------- 渲染器选项 -------------------------------------

    handleRendererOptions() {
        let win = app.createElement(OptionsWindow, {
            activeTabIndex: 1
        });
        app.addElement(win);
    }

    // ------------------------------- 帮助器选项 -----------------------------------------

    handleHelperOptions() {
        let win = app.createElement(OptionsWindow, {
            activeTabIndex: 2
        });
        app.addElement(win);
    }

    // ------------------------------ 滤镜选项 ---------------------------------------------

    handleFilterOptions() {
        let win = app.createElement(OptionsWindow, {
            activeTabIndex: 3
        });
        app.addElement(win);
    }

    // ------------------------------- 天气选项 ---------------------------------------------

    handleWeatherOptions() {
        let win = app.createElement(OptionsWindow, {
            activeTabIndex: 4
        });
        app.addElement(win);
    }

    // ------------------------------ 控制器模式 ---------------------------------------------

    handleChangeControlMode(value) {
        app.editor.controls.changeMode(value);
        app.storage.controlMode = value;
        this.forceUpdate();
    }

    // ----------------------------- 添加模式 ------------------------------------------------

    handleChangeAddMode(value) {
        app.storage.addMode = value;
        this.forceUpdate();
    }

    // --------------------------- 选择模式 ----------------------------------------------

    handleChangeSelectMode(value) {
        app.storage.selectMode = value;
        this.forceUpdate();
    }

    // ---------------------------- 语言选项 -------------------------------------------------

    handleChangeEnglish() { // 英语
        window.localStorage.setItem('lang', 'en-US');
        window.location.reload();
    }

    handleChangeChinese() { // 简体中文
        window.localStorage.setItem('lang', 'zh-CN');
        window.location.reload();
    }

    handleChangeTraditionalChinese() { // 繁体中文
        window.localStorage.setItem('lang', 'zh-TW');
        window.location.reload();
    }

    handleChangeJapanese() { // 日语
        window.localStorage.setItem('lang', 'ja-JP');
        window.location.reload();
    }

    handleChangeKorean() {
        window.localStorage.setItem('lang', 'ko-KR');
        window.location.reload();
    }

    handleChangeRussian() {
        window.localStorage.setItem('lang', 'ru-RU');
        window.location.reload();
    }

    handleChangeFrench() {
        window.localStorage.setItem('lang', 'fr-FR');
        window.location.reload();
    }

    // ---------------------------------- 调试模式 -------------------------------

    handleEnableDebugMode() {
        app.storage.debug = true;
        window.location.reload();
    }

    handleDisableDebugMode() {
        app.storage.debug = false;
        window.location.reload();
    }
}

export default OptionsMenu;