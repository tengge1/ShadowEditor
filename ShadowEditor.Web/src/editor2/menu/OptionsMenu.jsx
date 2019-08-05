import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';
import OptionsWindow from '../window/OptionsWindow.jsx';

/**
 * 选项菜单
 * @author tengge / https://github.com/tengge1
 */
class OptionsMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleRendererOptions = this.handleRendererOptions.bind(this);
        this.handleHelperOptions = this.handleHelperOptions.bind(this);
        this.handleFilterOptions = this.handleFilterOptions.bind(this);

        this.handleChangeEnglish = this.handleChangeEnglish.bind(this);
        this.handleChangeChinese = this.handleChangeChinese.bind(this);
    }

    render() {
        const { className, style } = this.props;

        return <MenuItem title={L_OPTIONS}>
            <MenuItem title={L_RENDERER} onClick={this.handleRendererOptions}></MenuItem>
            <MenuItem title={L_HELPERS} onClick={this.handleHelperOptions}></MenuItem>
            <MenuItem title={L_FILTER} onClick={this.handleFilterOptions}></MenuItem>
            <MenuItemSeparator></MenuItemSeparator>
            <MenuItem title={L_LANGUAGE}>
                <MenuItem title={'English'} onClick={this.handleChangeEnglish}></MenuItem>
                <MenuItem title={'汉语'} onClick={this.handleChangeChinese}></MenuItem>
            </MenuItem>
        </MenuItem>;
    }

    // ---------------------------------- 渲染器选项 -------------------------------------

    handleRendererOptions() {
        let win = app.createElement(OptionsWindow, {
            activeTab: 0,
        });
        app.addElement(win);
    }

    // ------------------------------- 帮助器选项 -----------------------------------------

    handleHelperOptions() {
        let win = app.createElement(OptionsWindow, {
            activeTab: 1,
        });
        app.addElement(win);
    }

    // ------------------------------ 滤镜选项 ---------------------------------------------

    handleFilterOptions() {
        let win = app.createElement(OptionsWindow, {
            activeTab: 2,
        });
        app.addElement(win);
    }

    // ---------------------------- 语言选项 -------------------------------------------------

    handleChangeEnglish() {
        window.localStorage.setItem('lang', 'en-US');
        window.location.reload();
    }

    handleChangeChinese() {
        window.localStorage.setItem('lang', 'zh-CN');
        window.location.reload();
    }
}

export default OptionsMenu;