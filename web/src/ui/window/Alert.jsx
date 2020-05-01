import './css/Alert.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Window from './Window.jsx';
import Content from '../common/Content.jsx';
import Buttons from '../common/Buttons.jsx';
import Button from '../form/Button.jsx';

/**
 * 提示框
 */
class Alert extends React.Component {
    constructor(props) {
        super(props);

        this.handleOK = this.handleOK.bind(this, props.onOK);
        this.handleClose = this.handleClose.bind(this, props.onClose);
    }

    render() {
        const { className, style, title, children, hidden, mask, okText } = this.props;

        return <Window
            className={classNames('Alert', className)}
            style={style}
            title={title}
            hidden={hidden}
            mask={mask}
            onClose={this.handleClose}
               >
            <Content>{children}</Content>
            <Buttons>
                <Button onClick={this.handleOK}>{okText}</Button>
            </Buttons>
        </Window>;
    }

    handleOK(onOK, event) {
        onOK && onOK(event);
    }

    handleClose(onClose, event) {
        onClose && onClose(event);
    }
}

Alert.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    children: PropTypes.node,
    hidden: PropTypes.bool,
    mask: PropTypes.bool,
    okText: PropTypes.string,
    onOK: PropTypes.func,
    onClose: PropTypes.func
};

Alert.defaultProps = {
    className: null,
    style: null,
    title: 'Message',
    children: null,
    hidden: false,
    mask: false,
    okText: 'OK',
    onOK: null,
    onClose: null
};

export default Alert;