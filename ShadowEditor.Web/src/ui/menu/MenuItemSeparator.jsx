import './css/MenuItemSeparator.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 菜单项分隔符
 * @author tengge / https://github.com/tengge1
 */
class MenuItemSeparator extends React.Component {
    render() {
        const { className, style, direction, show } = this.props;

        return <li
            className={classNames('MenuItemSeparator', direction && direction, !show && 'hidden', className)}
            style={style}
               >
            <div className='separator' />
        </li>;
    }
}

MenuItemSeparator.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    show: PropTypes.bool
};

MenuItemSeparator.defaultProps = {
    className: null,
    style: null,
    direction: 'vertical',
    show: true
};

export default MenuItemSeparator;