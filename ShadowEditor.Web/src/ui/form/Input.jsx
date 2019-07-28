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
        const { className, style, name, type, value, min, max, step, disabled } = this.props;

        let val = value === undefined || value === null ? '' : value;

        return <input
            className={classNames('Input', className)}
            style={style}
            type={type}
            value={val}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            onChange={this.handleChange}
            onInput={this.handleInput} />;
    }

    handleChange(onChange, event) {
        const value = event.target.value;

        if (this.props.type === 'number') {
            if (value.trim() !== '') {
                const precision = this.props.precision;

                if (precision === 0) {
                    onChange && onChange(parseInt(value), this.props.name, event);
                } else {
                    onChange && onChange(parseInt(parseFloat(value) * 10 ** precision) / 10 ** precision, this.props.name, event);
                }
            } else {
                onChange && onChange(null, this.props.name, event);
            }
        } else {
            onChange && onChange(value, this.props.name, event);
        }
    }

    handleInput(onInput, event) {
        const value = event.target.value;
        if (this.props.type === 'number') {
            if (value.trim() !== '') {
                onInput && onInput(parseFloat(value), this.props.name, event);
            } else {
                onInput && onInput(null, this.props.name, event);
            }
        } else {
            onInput && onInput(value, this.props.name, event);
        }
    }
}

Input.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    type: PropTypes.oneOf(['text', 'number', 'color']),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    precision: PropTypes.number,
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
    min: null,
    max: null,
    step: null,
    precision: 3,
    disabled: false,
    onChange: null,
    onInput: null,
};

export default Input;