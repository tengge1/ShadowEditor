import './css/MenuItemSeparator.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 菜单项分隔符
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class MenuItemSeparator extends React.Component {
    render() {
        const { className, style } = this.props;

        return <li className={classNames('MenuItemSeparator', className)} style={style}>
            <div className='separator'></div>
        </li>;
    }
}

MenuItemSeparator.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default MenuItemSeparator;