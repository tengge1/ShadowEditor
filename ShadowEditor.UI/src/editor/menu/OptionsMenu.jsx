import PropTypes from 'prop-types';
import MenuItem from '../../menu/MenuItem.jsx';
import MenuItemSeparator from '../../menu/MenuItemSeparator.jsx';

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

        return <MenuItem title={'Options'}>
            <MenuItem title={'Surface'}></MenuItem>
            <MenuItem title={'Helpers'}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={'Renderer'}></MenuItem>
            <MenuItem title={'Filter'}></MenuItem>
        </MenuItem>;
    }
}

export default OptionsMenu;