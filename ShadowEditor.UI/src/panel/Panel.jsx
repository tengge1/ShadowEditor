import classNames from 'classnames/bind';

/**
 * 面板
 * @author tengge / https://github.com/tengge1
 * @property {String} title 标题
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 */
class Panel extends React.Component {
    render() {
        const { title, className, style, children } = this.props;

        return <div className={classNames('Panel', className)} style={style}>
            <div className="header">
                <span class="title">{title}</span>
                <div className="controls">
                    <div class="control">
                        <i className="iconfont icon-up-arrow"></i>
                    </div>
                </div>
            </div>
            <div className="body">
                {children}
            </div>
        </div>;
    }
}

export default Panel;