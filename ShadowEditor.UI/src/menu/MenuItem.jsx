import './css/MenuItem.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 菜单项
 * @author tengge / https://github.com/tengge1
 * @property {String} title 标题
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 * @property {Boolean} show 是否显示
 */
class MenuItem extends React.Component {
    render() {
        const { title, className, style, children, show } = this.props;

        return <li className={classNames('header-item', show ? null : 'hidden', className)} style={style}>
            <span>{title}</span>
        </li>;
    }
}

MenuItem.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.element,
    show: PropTypes.bool,
};

MenuItem.defaultProps = {
    show: true,
};

export default MenuItem;