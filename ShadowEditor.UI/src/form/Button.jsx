import classNames from 'classnames/bind';

/**
 * 按钮
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class Button extends React.Component {
    render() {
        const { className, style, children } = this.props;
        return <button className={classNames('Button', className)} style={style}>
            {children}
        </button>;
    }
}

export default Button;