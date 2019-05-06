import classNames from 'classnames/bind';

/**
 * 水平布局
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {String} children 内容
 */
class HBoxLayout extends React.Component {
    render() {
        const { className, children } = this.props;

        return <div className={classNames('HBox', className)}>{children}</div>;
    }
}

export default HBoxLayout;