import './css/Toast.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 提示窗
 */
class Toast extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style, children } = this.props;

        return <div className={'ToastMark'}>
            <div className={classNames('Toast', className)}
                style={style}
            >
                {children}
            </div>
        </div>;
    }
}

Toast.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};

Toast.defaultProps = {
    className: null,
    style: null,
    children: null
};

export default Toast;