import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 选项菜单
 * @author tengge / https://github.com/tengge1
 */
class OptionsMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleSurfaceOptions = this.handleSurfaceOptions.bind(this);
        this.handleRendererOptions = this.handleRendererOptions.bind(this);
        this.handleHelperOptions = this.handleHelperOptions.bind(this);
        this.handleFilterOptions = this.handleFilterOptions.bind(this);
    }

    render() {
        const { className, style } = this.props;

        return <MenuItem title={L_OPTIONS}>
            <MenuItem title={L_SURFACE} onClick={this.handleSurfaceOptions}></MenuItem>
            <MenuItem title={L_HELPERS} onClick={this.handleRendererOptions}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_RENDERER} onClick={this.handleHelperOptions}></MenuItem>
            <MenuItem title={L_FILTER} onClick={this.handleFilterOptions}></MenuItem>
        </MenuItem>;
    }

    // ---------------------------------- 外观选项 ---------------------------------------

    handleSurfaceOptions() {
        if (this.optionsWindow === undefined) {
            this.optionsWindow = new OptionsWindow({
                app: this.app
            });
            this.optionsWindow.render();
        }
        this.optionsWindow.show();
        this.optionsWindow.changeTab(L_SURFACE);
    }

    // ---------------------------------- 渲染器选项 -------------------------------------

    handleRendererOptions() {
        if (this.optionsWindow === undefined) {
            this.optionsWindow = new OptionsWindow({
                app: this.app
            });
            this.optionsWindow.render();
        }
        this.optionsWindow.show();
        this.optionsWindow.changeTab(L_RENDERER);
    }

    // ------------------------------- 帮助器选项 -----------------------------------------

    handleHelperOptions() {
        if (this.optionsWindow === undefined) {
            this.optionsWindow = new OptionsWindow({
                app: this.app
            });
            this.optionsWindow.render();
        }
        this.optionsWindow.show();
        this.optionsWindow.changeTab(L_HELPERS);
    }

    // ------------------------------ 滤镜选项 ---------------------------------------------

    handleFilterOptions() {
        if (this.optionsWindow === undefined) {
            this.optionsWindow = new OptionsWindow({
                app: this.app
            });
            this.optionsWindow.render();
        }
        this.optionsWindow.show();
        this.optionsWindow.changeTab(L_FILTER);
    }
}

export default OptionsMenu;