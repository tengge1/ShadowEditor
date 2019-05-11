import classNames from 'classnames/bind';

/**
 * 内容
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class Content extends React.Component {
    render() {
        const { className, style, children } = this.props;

        return <div className={classNames('Content', className)} style={style}>{children}</div>;
    }
}

export default Content;