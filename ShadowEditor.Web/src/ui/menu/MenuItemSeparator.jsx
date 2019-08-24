import './css/MenuItemSeparator.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 菜单项分隔符
 * @author tengge / https://github.com/tengge1
 */
class MenuItemSeparator extends React.Component {
    render() {
        const { className, style, show } = this.props;

        return <li
            className={classNames('MenuItemSeparator', !show && 'hidden', className)}
            style={style}>
            <div className='separator'></div>
        </li>;
    }
}

MenuItemSeparator.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool,
};

MenuItemSeparator.defaultProps = {
    className: null,
    style: null,
    show: true,
};

export default MenuItemSeparator;