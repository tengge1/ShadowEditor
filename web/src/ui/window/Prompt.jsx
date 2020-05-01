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
            value: props.value
        };

        this.handleOK = this.handleOK.bind(this, props.onOK);
        this.handleClose = this.handleClose.bind(this, props.onClose);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { className, style, title, content, hidden, mask, okText } = this.props;

        return <Window
            className={classNames('Prompt', className)}
            style={style}
            title={title}
            hidden={hidden}
            mask={mask}
            onClose={this.handleClose}
               >
            <Content>
                {content}
                <Input value={this.state.value}
                    onChange={this.handleChange}
                />
            </Content>
            <Buttons>
                <Button onClick={this.handleOK}>{okText}</Button>
            </Buttons>
        </Window>;
    }

    handleOK(onOK, event) {
        onOK && onOK(this.state.value, event);
    }

    handleClose(onClose, event) {
        onClose && onClose(event);
    }

    handleChange(value) {
        this.setState({ value });
    }
}

Prompt.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    content: PropTypes.node,
    value: PropTypes.string,
    hidden: PropTypes.bool,
    mask: PropTypes.bool,
    okText: PropTypes.string,
    onOK: PropTypes.func,
    onClose: PropTypes.func
};

Prompt.defaultProps = {
    className: null,
    style: null,
    title: 'Prompt',
    content: null,
    value: '',
    hidden: false,
    mask: false,
    okText: 'OK',
    onOK: null,
    onClose: null
};

export default Prompt;