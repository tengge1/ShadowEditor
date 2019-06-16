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

        var dom = this.dom.current;
        var left = dom.style.left === '' ? 0 : parseInt(dom.style.left.replace('px', ''));
        var top = dom.style.top === '' ? 0 : parseInt(dom.style.top.replace('px', ''));

        this.offsetX = event.clientX - left;
        this.offsetY = event.clientY - top;
    }

    handleMouseMove(event) {
        if (!this.isDown) {
            return;
        }

        var dx = event.clientX - this.offsetX;
        var dy = event.clientY - this.offsetY;

        var dom = this.dom.current;
        dom.style.left = `${dx}px`;
        dom.style.top = `${dy}px`;
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

    componentDidMount() {
        document.body.addEventListener('mousemove', this.handleMouseMove);
        document.body.addEventListener('mouseup', this.handleMouseUp);
    }

    componentWillUnmount() {
        document.body.removeEventListener('mousemove', this.handleMouseMove);
        document.body.removeEventListener('mouseup', this.handleMouseUp);
    }

    render() {
        const { className, style, title, children, mask } = this.props;

        const content = children.filter(n => {
            return n.type === Content;
        })[0];

        const buttons = children.filter(n => {
            return n.type === Buttons;
        })[0];

        return <div className={classNames('WindowMask', mask && 'mask', this.state.hidden && 'hidden')}>
            <div className={classNames('Window', className)}
                style={style}
                ref={this.dom}>
                <div className={'wrap'}>
                    <div className={'title'}
                        onMouseDown={this.handleMouseDown}>
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
            </div>
        </div>;
    }
}

Window.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    children: PropTypes.node,
    hidden: PropTypes.bool,
    mask: PropTypes.bool,
};

Window.defaultProps = {
    className: null,
    style: null,
    title: 'Window',
    children: null,
    hidden: false,
    mask: true,
};

export default Window;