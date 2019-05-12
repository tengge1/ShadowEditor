import PropTypes from 'prop-types';
import MenuItem from '../../menu/MenuItem.jsx';
import MenuItemSeparator from '../../menu/MenuItemSeparator.jsx';

/**
 * 工具菜单
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class ToolMenu extends React.Component {
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

        return <MenuItem title={'Tool'}>
            <MenuItem title={'Arrange Map'}></MenuItem>
            <MenuItem title={'Arrange Mesh'}></MenuItem>
            <MenuItem title={'Arrange Thumbnail'}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={'Export Editor'}></MenuItem>
        </MenuItem>;
    }
}

ToolMenu.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default ToolMenu;