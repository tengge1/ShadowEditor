import './css/Panel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 面板
 * @author tengge / https://github.com/tengge1
 */
class Panel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { title, className, style, children, show, header, collapsible, collapsed } = this.props;

        const collapseControl = collapsible && <div className="control">
            <i className="iconfont icon-up-arrow"></i>
        </div>;

        const maximizeControl = collapsible && <div className="control">
            <i className="iconfont icon-maximize"></i>
        </div>;

        const minimizeControl = collapsible && <div className="control">
            <i className="iconfont icon-minimize"></i>
        </div>;

        const closeControl = collapsible && <div className="control">
            <i className="iconfont icon-close-thin"></i>
        </div>;

        return <div className={classNames('Panel', show ? null : 'hide', className)} style={style}>
            <div className={classNames('header', header ? null : 'hide')}>
                <span className="title">{title}</span>
                <div className="controls">
                    {collapseControl}
                    {maximizeControl}
                    {minimizeControl}
                    {closeControl}
                </div>
            </div>
            <div className="body">
                {children}
            </div>
        </div>;
    }
}

Panel.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    show: PropTypes.bool,
    header: PropTypes.bool,
    collapsible: PropTypes.bool,
    collapsed: PropTypes.bool,
};

Panel.defaultProps = {
    title: null,
    className: null,
    style: null,
    children: null,
    show: true,
    header: true,
    collapsible: false,
    collapsed: false,
};

export default Panel;