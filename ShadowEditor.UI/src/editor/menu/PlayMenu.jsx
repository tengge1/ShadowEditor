import PropTypes from 'prop-types';
import MenuItem from '../../menu/MenuItem.jsx';
import MenuItemSeparator from '../../menu/MenuItemSeparator.jsx';

/**
 * 播放菜单
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
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
        const { className, style } = this.props;

        return <MenuItem title={'Play'}>
            <MenuItem title={'Play'}></MenuItem>
            <MenuItem title={'Play Fullscreen'}></MenuItem>
            <MenuItem title={'Play New Window'}></MenuItem>
        </MenuItem>;
    }
}

PlayMenu.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default PlayMenu;