import './css/DropDownSeparator.css';
import classNames from 'classnames/bind';

/**
 * 下拉菜单分隔符
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class DropDownSeparator extends React.Component {
    render() {
        const { className, style } = this.props;

        return <li class={classNames('DropDownSeparator', className)} style={style}>
            <div class='separator'></div>
        </li>;
    }
}

export default DropDownSeparator;