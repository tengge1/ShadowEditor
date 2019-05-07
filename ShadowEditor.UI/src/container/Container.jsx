/**
 * 容器
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class Container extends React.Component {
    render() {
        const { className, style, children } = this.props;

        return <div className={className} style={style}>{children}</div>;
    }
}

export default Container;