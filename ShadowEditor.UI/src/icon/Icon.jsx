import classNames from 'classnames/bind';

/**
 * 图标
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {String} children 内容
 */
class Icon extends React.Component {
    render() {
        const { className, children } = this.props;

        return <div className={classNames('Icon', className)}>{children}</div>;
    }
}

export default Icon;