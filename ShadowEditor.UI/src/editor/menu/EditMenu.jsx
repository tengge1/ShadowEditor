import PropTypes from 'prop-types';
import MenuItem from '../../menu/MenuItem.jsx';
import MenuItemSeparator from '../../menu/MenuItemSeparator.jsx';

/**
 * 编辑菜单
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class EditMenu extends React.Component {
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

        return <MenuItem title={'Edit'}>
            <MenuItem title={'Undo(Ctrl+Z)'}></MenuItem>
            <MenuItem title={'Redo(Ctrl+Y)'}></MenuItem>
            <MenuItem title={'Clear History'}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={'Clone'}></MenuItem>
            <MenuItem title={'Delete(Del)'}></MenuItem>
        </MenuItem>;
    }
}

EditMenu.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default EditMenu;