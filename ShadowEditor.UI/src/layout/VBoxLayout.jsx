import './css/VBoxLayout.css';
import classNames from 'classnames/bind';

/**
 * 竖直布局
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class VBoxLayout extends React.Component {
    render() {
        const { className, style, children } = this.props;

        return <div className={classNames('VBoxLayout', className)} style={style}>{children}</div>;
    }
}

export default VBoxLayout;