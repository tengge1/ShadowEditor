import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';
import OptionsWindow from '../window/OptionsWindow.jsx';

/**
 * 选项菜单
 * @author tengge / https://github.com/tengge1
 */
class OptionsMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        this.handleRendererOptions = this.handleRendererOptions.bind(this);
        this.handleHelperOptions = this.handleHelperOptions.bind(this);
        this.handleFilterOptions = this.handleFilterOptions.bind(this);

        this.handleChangeEnglish = this.handleChangeEnglish.bind(this);
        this.handleChangeChinese = this.handleChangeChinese.bind(this);

        this.handleEnableDebugMode = this.handleEnableDebugMode.bind(this);
        this.handleDisableDebugMode = this.handleDisableDebugMode.bind(this);
    }

    render() {
        const { className, style } = this.props;

        return <MenuItem title={_t('Options')}>
            <MenuItem title={_t('Renderer')} onClick={this.handleRendererOptions}></MenuItem>
            <MenuItem title={_t('Helpers')} onClick={this.handleHelperOptions}></MenuItem>
            <MenuItem title={_t('Filter')} onClick={this.handleFilterOptions}></MenuItem>
            <MenuItemSeparator></MenuItemSeparator>
            <MenuItem title={_t('Language')}>
                <MenuItem title={'English'} onClick={this.handleChangeEnglish}></MenuItem>
                <MenuItem title={'简体中文'} onClick={this.handleChangeChinese}></MenuItem>
                <MenuItem title={'繁體中文'} onClick={this.handleChangeTraditionalChinese}></MenuItem>
                <MenuItem title={'日本語'} onClick={this.handleChangeJapanese}></MenuItem>
                <MenuItem title={'한국어'} onClick={this.handleChangeKorean}></MenuItem>
                <MenuItem title={'русский'} onClick={this.handleChangeRussian}></MenuItem>
                <MenuItem title={'Le français'} onClick={this.handleChangeFrench}></MenuItem>
            </MenuItem>
            <MenuItem title={_t('Debug Mode')}>
                <MenuItem title={_t('Enable')} onClick={this.handleEnableDebugMode}></MenuItem>
                <MenuItem title={_t('Disable')} onClick={this.handleDisableDebugMode}></MenuItem>
            </MenuItem>
        </MenuItem>;
    }

    // ---------------------------------- 渲染器选项 -------------------------------------

    handleRendererOptions() {
        let win = app.createElement(OptionsWindow, {
            activeTabIndex: 0,
        });
        app.addElement(win);
    }

    // ------------------------------- 帮助器选项 -----------------------------------------

    handleHelperOptions() {
        let win = app.createElement(OptionsWindow, {
            activeTabIndex: 1,
        });
        app.addElement(win);
    }

    // ------------------------------ 滤镜选项 ---------------------------------------------

    handleFilterOptions() {
        let win = app.createElement(OptionsWindow, {
            activeTabIndex: 2,
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
        app.storage.set('debug', true);
        window.location.reload();
    }

    handleDisableDebugMode() {
        app.storage.set('debug', false);
        window.location.reload();
    }
}

export default OptionsMenu;