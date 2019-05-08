import classNames from 'classnames/bind';

/**
 * 选项卡面板
 * @author tengge / https://github.com/tengge1
 * @property {String} title 标题
 * @property {String} className 样式类
 * @property {String} children 内容
 */
class TabPanel extends React.Component {
    render() {
        const { title, className, children } = this.props;

        return <div className={classNames('TabPanel', className)}>
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

export default TabPanel;