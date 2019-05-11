import './css/Form.css';
import classNames from 'classnames/bind';

/**
 * 表单
 * @author tengge / https://github.com/tengge1
 * @property {String} direction 方向：horizontal, vertical
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class Form extends React.Component {
    render() {
        const { direction, className, style, children } = this.props;
        return <form className={classNames('Form', direction || 'vertical', className)} style={style}>
            {children}
        </form>;
    }
}

export default Form;