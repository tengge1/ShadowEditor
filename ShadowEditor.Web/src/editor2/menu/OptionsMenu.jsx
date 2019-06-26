import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 选项菜单
 * @author tengge / https://github.com/tengge1
 */
class OptionsMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.stopPropagation();
        alert('Hello, world!');
    }

    render() {
        const { className, style } = this.props;

        return <MenuItem title={L_OPTIONS}>
            <MenuItem title={L_SURFACE}></MenuItem>
            <MenuItem title={L_HELPERS}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_RENDERER}></MenuItem>
            <MenuItem title={L_FILTER}></MenuItem>
        </MenuItem>;
    }
}

export default OptionsMenu;