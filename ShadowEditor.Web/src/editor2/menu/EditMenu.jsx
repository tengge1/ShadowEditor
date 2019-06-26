import { PropTypes, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 编辑菜单
 * @author tengge / https://github.com/tengge1
 */
class EditMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style } = this.props;

        return <MenuItem title={L_EDIT}>
            <MenuItem title={`${L_UNDO}(Ctrl+Z)`}></MenuItem>
            <MenuItem title={`${L_REDO}(Ctrl+Y)`}></MenuItem>
            <MenuItem title={L_CLEAR_HISTORY}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_CLONE}></MenuItem>
            <MenuItem title={`${L_DELETE}(Del)`}></MenuItem>
        </MenuItem>;
    }
}

export default EditMenu;