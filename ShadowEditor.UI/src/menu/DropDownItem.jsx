import classNames from 'classnames/bind';

/**
 * 下拉菜单项
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class DropDownItem extends React.Component {
    render() {
        const { className, style, children } = this.props;

        return <li className={classNames('DropDownItem', className)} style={style}>
            <div className='prefix'></div>
            <div className='item'>
                <div className='icon'></div>
                <span className='text'>{children}</span>
            </div>
            <div className='suffix'>▶</div>
        </li>;
    }
}

export default DropDownItem;