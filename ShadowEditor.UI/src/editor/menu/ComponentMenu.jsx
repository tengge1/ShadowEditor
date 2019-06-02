import PropTypes from 'prop-types';
import MenuItem from '../../menu/MenuItem.jsx';
import MenuItemSeparator from '../../menu/MenuItemSeparator.jsx';

/**
 * 组件菜单
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class ComponentMenu extends React.Component {
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

        return <MenuItem title={'Component'}>
            <MenuItem title={'Background Music'}></MenuItem>
            <MenuItem title={'ParticleEmitter'}></MenuItem>
            <MenuItem title={'Sky'}></MenuItem>
            <MenuItem title={'Fire'}></MenuItem>
            <MenuItem title={'Water'}></MenuItem>
            <MenuItem title={'MenuItem'}>
                <MenuItem title={'Child 1'}></MenuItem>
                <MenuItem title={'Child 2'}>
                    <MenuItem title={'Child 1'}></MenuItem>
                    <MenuItem title={'Child 2'}></MenuItem>
                    <MenuItem title={'Child 3'}></MenuItem>
                </MenuItem>
                <MenuItem title={'Child 3'}></MenuItem>
                <MenuItem title={'Child 4'}></MenuItem>
                <MenuItem title={'Child 5'}></MenuItem>
            </MenuItem>
            <MenuItem title={'Smoke'}></MenuItem>
            <MenuItem title={'Cloth'}></MenuItem>
        </MenuItem>;
    }
}

ComponentMenu.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default ComponentMenu;