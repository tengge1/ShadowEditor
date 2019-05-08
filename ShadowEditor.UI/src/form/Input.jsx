import classNames from 'classnames/bind';

/**
 * 输入框
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} value 值
 */
class Input extends React.Component {
    render() {
        const { className, style, value } = this.props;

        return <input className={classNames('Input', className)} style={style} value={value} />;
    }
}

export default Input;