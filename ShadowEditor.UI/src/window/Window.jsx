import './css/Window.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Content from '../common/Content.jsx';
import Buttons from '../common/Buttons.jsx';

/**
 * 窗口
 */
class Window extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hidden: props.hidden,
        };

        this.dom = React.createRef();

        this.isDown = false;
        this.offsetX = 0;
        this.offsetY = 0;

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleMouseDown(event) {
        this.isDown = true;
        this.offsetX = event.offsetX;
        this.offsetY = event.offsetY;
    }

    handleMouseMove(event) {
        if (!this.isDown) {
            return;
        }
    }

    handleMouseUp(event) {
        this.isDown = false;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    handleClose(event) {
        this.setState({
            hidden: true,
        });
    }

    render() {
        const { className, style, title, children, width, height, mask } = this.props;

        const content = children.filter(n => {
            return n.type === Content;
        })[0];

        const buttons = children.filter(n => {
            return n.type === Buttons;
        })[0];

        const _style = Object.assign({}, style, {
            left: `calc(50% - ${width} / 2)`,
            top: `calc(50% - ${height} / 2)`,
            width: width,
            height: height,
        });

        const box = <div
            className={classNames('Window', this.state.hidden && 'hidden', className)}
            style={_style}
            ref={this.dom}>
            <div className={'wrap'}>
                <div className={'title'}
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp}>
                    <span>{title}</span>
                    <div className={'controls'}>
                        <i className={'iconfont icon-close icon'} onClick={this.handleClose}></i>
                    </div>
                </div>
                <div className={'content'}>{content && content.props.children}</div>
                <div className={'buttons'}>
                    <div className={'button-wrap'}>
                        {buttons && buttons.props.children}
                    </div>
                </div>
            </div>
        </div>;

        return mask ? <div className={'WindowMask'}>{box}</div> : box;
    }
}

Window.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    children: PropTypes.node,
    width: PropTypes.string,
    height: PropTypes.string,
    hidden: PropTypes.bool,
    mask: PropTypes.bool,
};

Window.defaultProps = {
    className: null,
    style: null,
    title: 'Window',
    children: null,
    width: '600px',
    height: '400px',
    hidden: false,
    mask: true,
};

export default Window;