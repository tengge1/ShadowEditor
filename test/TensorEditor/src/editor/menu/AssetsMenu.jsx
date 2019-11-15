import { PropTypes, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 资源菜单
 * @author tengge / https://github.com/tengge1
 */
class AssetsMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <MenuItem title={_t('Assets')}>
            <MenuItem title={_t('Download MNIST Assets')} onClick={this.handleUndo}></MenuItem>
        </MenuItem>;
    }

    // --------------------- 撤销 --------------------------

    handleUndo() {

    }
}

export default AssetsMenu;