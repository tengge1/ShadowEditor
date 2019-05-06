import classNames from 'classnames/bind';

/**
 * 工具栏
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {String} direction 方向：horizontal, vertical
 * @property {String} children 内容
 */
class Toolbar extends React.Component {
    render() {
        const { className, direction, children } = this.props;

        return <div className={classNames('Toolbar', direction ? direction : 'horizontal', className)}>{children}</div>;
    }
}

export default Toolbar;