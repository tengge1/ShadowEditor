import './css/Prompt.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Window from './Window.jsx';
import Content from '../common/Content.jsx';
import Input from '../form/Input.jsx';
import Buttons from '../common/Buttons.jsx';
import Button from '../form/Button.jsx';

/**
 * 弹窗输入框
 */
class Prompt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
        };

        this.handleOK = this.handleOK.bind(this, props.onOK);
        this.handleClose = this.handleClose.bind(this, props.onClose);
    }

    render() {
        const { className, style, title, children, hidden, mask, okText } = this.props;

        return <Window
            className={className}
            style={style}
            title={title}
            hidden={hidden}
            mask={mask}
            onClose={this.handleClose}>
            <Content>
                <Input value={children} onChange={this.handleChange} />
            </Content>
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

Prompt.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    children: PropTypes.node,
    hidden: PropTypes.bool,
    mask: PropTypes.bool,
    okText: PropTypes.string,
    onOK: PropTypes.func,
    onClose: PropTypes.func,
};

Prompt.defaultProps = {
    className: null,
    style: null,
    title: 'Prompt',
    children: null,
    hidden: false,
    mask: true,
    okText: 'OK',
    onOK: null,
    onClose: null,
};

export default Prompt;