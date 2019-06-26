import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 光源菜单
 * @author tengge / https://github.com/tengge1
 */
class LightMenu extends React.Component {
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

        return <MenuItem title={'Light'}>
            <MenuItem title={'Ambient Light'}></MenuItem>
            <MenuItem title={'Directional Light'}></MenuItem>
            <MenuItem title={'Point Light'}></MenuItem>
            <MenuItem title={'Spot Light'}></MenuItem>
            <MenuItem title={'Hemisphere Light'}></MenuItem>
            <MenuItem title={'Rect Area Light'}></MenuItem>
        </MenuItem>;
    }
}

export default LightMenu;