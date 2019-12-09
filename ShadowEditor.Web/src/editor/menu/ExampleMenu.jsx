import { MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 示例菜单
 * @author tengge / https://github.com/tengge1
 */
class ExampleMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleArkanoid = this.handleArkanoid.bind(this);
    }

    render() {
        return <MenuItem title={_t('Example')}>
            <MenuItem title={_t('Arkanoid')}
                onClick={this.handleArkanoid}
            />
            <MenuItemSeparator />
        </MenuItem>;
    }

    handleArkanoid() {

    }
}

export default ExampleMenu;