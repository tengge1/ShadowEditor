import './css/Accordion.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 折叠面板
 * @author tengge / https://github.com/tengge1
 */
class Accordion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: props.collapsed,
            maximized: props.maximized,
            closed: props.closed,
        };

        this.handleCollapse = this.handleCollapse.bind(this, props.onCollapse);
        this.handleMaximize = this.handleMaximize.bind(this, props.onMaximize);
        this.handleClose = this.handleClose.bind(this, props.onClose);
    }

    handleCollapse(onCollapse, event) {
        this.setState(state => ({
            collapsed: !state.collapsed,
        }));

        onCollapse && onCollapse(event);
    }

    handleMaximize(onMaximize, event) {
        this.setState(state => ({
            maximized: !state.maximized,
        }));

        onMaximize && onMaximize(event);
    }

    handleClose(onClose, event) {
        this.setState(state => ({
            closed: !state.closed,
        }));

        onClose && onClose(event);
    }

    render() {
        const { title, className, style, children, show, header,
            collapsible, collapsed, onCollapse,
            maximizable, maximized, onMaximize,
            closable, closed, onClose } = this.props;

        const collapseControl = collapsible && <div className={'control'} onClick={this.handleCollapse}>
            {this.state.collapsed ? <i className={'iconfont icon-down-arrow'}></i> : <i className={'iconfont icon-up-arrow'}></i>}
        </div>;

        const maximizeControl = maximizable && <div className={'control'} onClick={this.handleMaximize}>
            {this.state.maximized ? <i className={'iconfont icon-minimize'}></i> : <i className={'iconfont icon-maximize'}></i>}
        </div>;

        const closeControl = closable && <div className={'control'} onClick={this.handleClose}>
            <i className={'iconfont icon-close-thin'}></i>
        </div>;

        return <div className={classNames('Accordion',
            this.state.maximized && 'maximized',
            this.state.collapsed && 'collapsed',
            this.state.closed && 'hidden',
            !show && 'hidden',
            className)} style={style}>
            <div className={classNames('header', header ? null : 'hidden')}>
                <span className="title">{title}</span>
                <div className="controls">
                    {collapseControl}
                    {maximizeControl}
                    {closeControl}
                </div>
            </div>
            <div className={'body'}>
                {children}
            </div>
        </div>;
    }
}

Accordion.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    show: PropTypes.bool,
    header: PropTypes.bool,
    collapsible: PropTypes.bool,
    collapsed: PropTypes.bool,
    onCollapse: PropTypes.func,
    maximizable: PropTypes.bool,
    maximized: PropTypes.bool,
    onMaximize: PropTypes.bool,
    closable: PropTypes.bool,
    closed: PropTypes.bool,
    onClose: PropTypes.func,
};

Accordion.defaultProps = {
    title: null,
    className: null,
    style: null,
    children: null,
    show: true,
    header: true,
    collapsible: false,
    collapsed: false,
    onCollapse: null,
    maximizable: false,
    maximized: false,
    onMaximize: null,
    closable: false,
    closed: false,
    onClose: null,
};

export default Accordion;