import classNames from 'classnames/bind';

/**
 * 竖直布局
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {String} children 内容
 */
class VBoxLayout extends React.Component {
    render() {
        const { className, children } = this.props;

        return <div className={classNames('VBox', className)}>{children}</div>;
    }
}

export default VBoxLayout;