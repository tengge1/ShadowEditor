import classNames from 'classnames/bind';

/**
 * 面板
 * @author tengge / https://github.com/tengge1
 * @property {String} title 标题
 * @property {String} className 样式类
 * @property {String} region 在BorderLayout中的位置，west, east, north, south
 * @property {String} children 内容
 */
class Panel extends React.Component {
    render() {
        const { title, className, region, children } = this.props;

        return <div className={classNames('Panel', region, className)}>
            <div className="wrap">
                <div className="title">
                    <div className="icon">
                        <i className="iconfont icon-shadow"></i>
                    </div>
                    <span>{title}</span>
                    {/*<div className="controls">
                        <div className="control">
                            <i className="iconfont icon-maximize"></i>
                        </div>
                        <div className="control">
                            <i className="iconfont icon-minus"></i>
                        </div>
                        <div className="control">
                            <i className="iconfont icon-close"></i>
                        </div>
    </div>*/}
                </div>
                <div className="content">
                    {children}
                </div>
            </div>
            <div className="resize"></div>
        </div>;
    }
}

export default Panel;