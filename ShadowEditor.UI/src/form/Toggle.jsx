import './css/Toggle.css';
import classNames from 'classnames/bind';

/**
 * 开关
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {Boolean} selected 是否选中
 * @property {Boolean} disabled 是否禁用
 */
class Toggle extends React.Component {
    render() {
        const { className, style, selected, disabled } = this.props;
        return <div className={classNames('Toggle', selected ? 'selected' : null, disabled ? 'disabled' : null, className)} style={style}></div>;
    }
}

export default Toggle;