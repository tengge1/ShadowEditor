import classNames from 'classnames/bind';

/**
 * 下拉菜单
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class DropDown extends React.Component {
    render() {
        const { className, style, children } = this.props;

        return <div className={classNames('DropDown', className)} style={style}>
            <ul className='wrap'>
                {children}
            </ul>
        </div>;
    }
}

export default DropDown;