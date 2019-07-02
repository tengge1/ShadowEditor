import './css/Toast.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 提示窗
 */
class Toast extends React.Component {
    constructor(props) {
        super(props);

        this.el = document.createElement('div');
    }

    render() {
        const { className, style, children } = this.props;

        return React.createPortal(<div
            className={classNames('Toast', className)}
            style={style}>
            {children}
        </div>, this.el);
    }

    componentDidMount() {
        document.body.appendChild(this.el);
    }

    componentWillUnmount() {
        document.body.removeChild(this.el);
    }
}

Toast.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
};

Toast.defaultProps = {
    className: null,
    style: null,
    children: null,
};

export default Toast;