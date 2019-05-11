import './css/Label.css';
import classNames from 'classnames/bind';

/**
 * 标签
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class Label extends React.Component {
    render() {
        const { className, style, children } = this.props;

        return <label className={classNames('Label', className)} style={style}>
            {children}
        </label>;
    }
}

export default Label;