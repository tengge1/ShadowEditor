import classNames from 'classnames/bind';

/**
 * 菜单项
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class MenuItem extends React.Component {
    render() {
        const { className, style, children } = this.props;

        return <li className={classNames('header-item', className)} style={style}>
            <span>{children}</span>
        </li>;
    }
}

export default MenuItem;