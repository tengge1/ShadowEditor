import PropTypes from 'prop-types';
import MenuItem from '../../menu/MenuItem.jsx';
import MenuItemSeparator from '../../menu/MenuItemSeparator.jsx';

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