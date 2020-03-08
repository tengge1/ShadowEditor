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

        this.handleChangeEnglish = this.handleChangeEnglish.bind(this);
        this.handleChangeChinese = this.handleChangeChinese.bind(this);

        this.handleEnableDebugMode = this.handleEnableDebugMode.bind(this);
        this.handleDisableDebugMode = this.handleDisableDebugMode.bind(this);
    }

    render() {
        const isLogin = !app.server.enableAuthority || app.server.isLogin;

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
            <MenuItem title={_t('Language')}>
                <MenuItem title={'English'}
                    onClick={this.handleChangeEnglish}
                />
                <MenuItem title={'简体中文'}
                    onClick={this.handleChangeChinese}
                />
                <MenuItem title={'繁體中文'}
                    onClick={this.handleChangeTraditionalChinese}
                />
                <MenuItem title={'日本語'}
                    onClick={this.handleChangeJapanese}
                />
                <MenuItem title={'한국어'}
                    onClick={this.handleChangeKorean}
                />
                <MenuItem title={'русский'}
                    onClick={this.handleChangeRussian}
                />
                <MenuItem title={'Le français'}
                    onClick={this.handleChangeFrench}
                />
            </MenuItem>
            {isLogin && <MenuItem title={_t('Debug Mode')}>
                <MenuItem title={_t('Enable')}
                    onClick={this.handleEnableDebugMode}
                />
                <MenuItem title={_t('Disable')}
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