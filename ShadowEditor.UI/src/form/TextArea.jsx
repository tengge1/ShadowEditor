import './css/TextArea.css';
import classNames from 'classnames/bind';

/**
 * 文本域
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class TextArea extends React.Component {
    render() {
        const { className, style, children } = this.props;

        return <textarea className={classNames('TextArea', className)} style={style}>{children}</textarea>;
    }
}

export default TextArea;