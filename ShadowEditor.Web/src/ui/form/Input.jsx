import './css/Input.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 输入框
 * @author tengge / https://github.com/tengge1
 */
class Input extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this, props.onChange);
        this.handleInput = this.handleInput.bind(this, props.onInput);
    }

    render() {
        const { className, style, name, type, value, disabled } = this.props;

        return <input
            className={classNames('Input', className)}
            style={style}
            name={name}
            type={type}
            value={value}
            disabled={disabled}
            onChange={this.handleChange}
            onInput={this.handleInput} />;
    }

    handleChange(onChange, event) {
        const value = event.target.value;
        onChange && onChange(this.props.type === 'number' ? parseFloat(value) : value, this.props.name, event);
    }

    handleInput(onInput, event) {
        const value = event.target.value;
        onInput && onInput(this.props.type === 'number' ? parseFloat(value) : value, this.props.name, event);
    }
}

Input.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    type: PropTypes.oneOf(['text', 'number']),
    value: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
};

Input.defaultProps = {
    className: null,
    style: null,
    name: null,
    type: 'text',
    value: '',
    disabled: false,
    onChange: null,
    onInput: null,
};

export default Input;