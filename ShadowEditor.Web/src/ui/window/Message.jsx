import './css/Message.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 提示窗
 */
class Message extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style, children, type } = this.props;

        return <div className={classNames('Message', type, className)}
            style={style}
               >
            <i className={classNames('iconfont', `icon-${type}`)} />
            <p className={'content'}>{children}</p>
        </div>;
    }
}

Message.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    type: PropTypes.oneOf(['info', 'success', 'warn', 'error'])
};

Message.defaultProps = {
    className: null,
    style: null,
    children: null,
    type: 'info'
};

export default Message;