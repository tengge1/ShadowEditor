import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 播放菜单
 * @author tengge / https://github.com/tengge1
 */
class PlayMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.stopPropagation();
        alert('Hello, world!');
    }

    render() {
        return <MenuItem title={'Play'}>
            <MenuItem title={'Play'}></MenuItem>
            <MenuItem title={'Play Fullscreen'}></MenuItem>
            <MenuItem title={'Play New Window'}></MenuItem>
        </MenuItem>;
    }
}

export default PlayMenu;