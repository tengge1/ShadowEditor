import './css/MenuItemSeparator.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 菜单项分隔符
 * @author tengge / https://github.com/tengge1
 */
class MenuItemSeparator extends React.Component {
    render() {
        const { className, style, ...others } = this.props;

        return <li
            className={classNames('MenuItemSeparator', className)}
            style={style}
            {...others}>
            <div className='separator'></div>
        </li>;
    }
}

MenuItemSeparator.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

MenuItemSeparator.defaultProps = {
    className: null,
    style: null,
};

export default MenuItemSeparator;