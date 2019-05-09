import classNames from 'classnames/bind';

/**
 * 复选框
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class CheckBox extends React.Component {
    render() {
        const { className, style, children } = this.props;
        return <input type={'checkbox'} className={classNames('CheckBox', className)} style={style} />;
    }
}

export default CheckBox;