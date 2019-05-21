import './css/TextArea.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 文本域
 * @author tengge / https://github.com/tengge1
 */
class TextArea extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
        };

        this.handleChange = this.handleChange.bind(this, props.onChange);
        this.handleInput = this.handleInput.bind(this, props.onInput);
    }

    handleChange(onChange, event) {
        this.setState({
            value: event.target.value,
        });
        onChange && onChange(event.target.value, event);
    }

    handleInput(onInput, event) {
        this.setState({
            value: event.target.value,
        });
        onInput && onInput(event.target.value, event);
    }

    render() {
        const { className, style, value, onChange, onInput, ...others } = this.props;

        return <textarea
            className={classNames('TextArea', className)}
            style={style}
            value={this.state.value}
            onChange={this.handleChange}
            onInput={this.handleInput}
            {...others}></textarea>;
    }
}

TextArea.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
};

TextArea.defaultProps = {
    className: null,
    style: null,
    value: '',
    onChange: null,
    onInput: null,
};

export default TextArea;