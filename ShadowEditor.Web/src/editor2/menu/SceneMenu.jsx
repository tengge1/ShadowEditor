import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 场景菜单
 * @author tengge / https://github.com/tengge1
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

export default SceneMenu;