import { MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 视图菜单
 * @author tengge / https://github.com/tengge1
 */
class ViewMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleShowStats = this.handleShowStats.bind(this);
        this.handleShowGrid = this.handleShowGrid.bind(this);
        this.handleShowView = this.handleShowView.bind(this);
    }

    render() {
        return <MenuItem title={_t('View')}>
            <MenuItem title={_t('Stats')}
                checked
                onClick={this.handleShowStats}
            />
            <MenuItem title={_t('Grid')}
                selected
                onClick={this.handleShowGrid}
            />
            <MenuItem title={_t('Camera View')}
                onClick={this.handleShowView}
            />
            <MenuItemSeparator />
        </MenuItem>;
    }

    handleShowStats() {

    }

    handleShowGrid() {

    }

    handleShowView() {

    }
}

export default ViewMenu;