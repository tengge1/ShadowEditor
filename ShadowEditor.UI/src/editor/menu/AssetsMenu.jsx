import PropTypes from 'prop-types';
import MenuItem from '../../menu/MenuItem.jsx';
import MenuItemSeparator from '../../menu/MenuItemSeparator.jsx';

/**
 * 资源菜单
 * @author tengge / https://github.com/tengge1
 */
class AssetsMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.stopPropagation();
        alert('Hello, world!');
    }

    render() {
        return <MenuItem title={'Assets'}>
            <MenuItem title={'Export Geometry'}></MenuItem>
            <MenuItem title={'Export Object'}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={'Export GLTF'}></MenuItem>
            <MenuItem title={'Export OBJ'}></MenuItem>
            <MenuItem title={'Export PLY'}></MenuItem>
            <MenuItem title={'Export STL Binary'}></MenuItem>
            <MenuItem title={'Export STL'}></MenuItem>
        </MenuItem>;
    }
}

export default AssetsMenu;