import './css/MenuBar.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 菜单栏
 * @author tengge / https://github.com/tengge1
 */
class MenuBar extends React.Component {
    render() {
        const { className, style, children, ...others } = this.props;

        return <ul
            className={classNames('MenuBar', className)}
            style={style}
            {...others}>{children}</ul>;
    }
}

MenuBar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
};

MenuBar.defaultProps = {
    className: null,
    style: null,
    children: null,
};

export default MenuBar;