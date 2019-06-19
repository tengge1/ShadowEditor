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
            maximized: props.maximized,
        };

        this.handleMaximize = this.handleMaximize.bind(this, props.onMaximize);
    }

    handleMaximize(onMaximize, event) {
        this.setState(state => ({
            maximized: !state.maximized,
        }));

        onMaximize && onMaximize(event);
    }

    render() {
        const { title, className, style, children, show,
            maximizable, maximized, onMaximize,
            closable } = this.props;

        const maximizeControl = maximizable && <div className={'control'} onClick={this.handleMaximize}>
            {this.state.maximized ? <i className={'iconfont icon-minimize'}></i> : <i className={'iconfont icon-maximize'}></i>}
        </div>;

        return <div className={classNames('Accordion',
            this.state.maximized && 'maximized',
            !show && 'hidden',
            className)} style={style}>
            <div className={'header'}>
                <span className="title">{title}</span>
                <div className="controls">
                    {maximizeControl}
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
    maximizable: PropTypes.bool,
    maximized: PropTypes.bool,
    onMaximize: PropTypes.bool,
};

Accordion.defaultProps = {
    title: null,
    className: null,
    style: null,
    children: null,
    show: true,
    maximizable: false,
    maximized: false,
    onMaximize: null,
};

export default Accordion;