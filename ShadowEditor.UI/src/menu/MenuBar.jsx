import './css/MenuBar.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 菜单栏
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class MenuBar extends React.Component {
    render() {
        const { className, style, children } = this.props;

        return <ul className={classNames('MenuBar', className)} style={style}>{children}</ul>;
    }
}

MenuBar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.element,
};

export default MenuBar;