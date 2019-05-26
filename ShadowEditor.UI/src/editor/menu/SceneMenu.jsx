import PropTypes from 'prop-types';
import MenuItem from '../../menu/MenuItem.jsx';
import MenuItemSeparator from '../../menu/MenuItemSeparator.jsx';

/**
 * 场景菜单
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class SceneMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        alert('Hello, world!');
    }

    render() {
        const { className, style } = this.props;

        return <MenuItem title={'Scene'}>
            <MenuItem title={'New'}>
                <MenuItem title={'Empty Scene'} onClick={this.handleClick}></MenuItem>
                <MenuItem title={'GIS Scene'}></MenuItem>
            </MenuItem>
            <MenuItem title={'Save'}></MenuItem>
            <MenuItem title={'Save As'}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={'Export Scene'}></MenuItem>
        </MenuItem>;
    }
}

SceneMenu.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default SceneMenu;