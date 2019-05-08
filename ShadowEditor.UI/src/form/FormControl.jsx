import classNames from 'classnames/bind';

/**
 * 表单项
 * @author tengge / https://github.com/tengge1
 * @property {String} title 标题
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class FormControl extends React.Component {
    render() {
        const { title, className, style, children } = this.props;

        return <div className={classNames('FormControl', className)} style={style}>
            {children}
        </div>;
    }
}

export default FormControl;