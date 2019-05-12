import PropTypes from 'prop-types';
import MenuItem from '../../menu/MenuItem.jsx';
import MenuItemSeparator from '../../menu/MenuItemSeparator.jsx';

/**
 * 帮助菜单
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class HelpMenu extends React.Component {
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

        return <MenuItem title={'Help'}>
            <MenuItem title={'Source'}></MenuItem>
            <MenuItem title={'Examples'}></MenuItem>
            <MenuItem title={'Documents'}></MenuItem>
            <MenuItem title={'About'}></MenuItem>
        </MenuItem>;
    }
}

HelpMenu.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default HelpMenu;