import PropTypes from 'prop-types';
import MenuItem from '../../menu/MenuItem.jsx';
import MenuItemSeparator from '../../menu/MenuItemSeparator.jsx';

/**
 * 光源菜单
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
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

LightMenu.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default LightMenu;