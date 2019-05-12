import './css/AbsoluteLayout.css';
import classNames from 'classnames/bind';

/**
 * 绝对定位布局
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class AbsoluteLayout extends React.Component {
    render() {
        const { className, style, children } = this.props;

        return <div className={classNames('AbsoluteLayout', className)} style={style}>{children}</div>;
    }
}

export default AbsoluteLayout;