import './css/Select.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 输入框
 * @author tengge / https://github.com/tengge1
 */
class Select extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    render() {
        const { className, style, options, value, disabled } = this.props;

        return <select
            className={classNames('Select', className)}
            style={style}
            value={value}
            disabled={disabled}
            onChange={this.handleChange}>
            {options && Object.keys(options).map(n => {
                return <option value={n} key={n}>{options[n]}</option>;
            })}
        </select>;
    }

    handleChange(onChange, event) {
        const selectedIndex = event.target.selectedIndex;

        if (selectedIndex === -1) {
            onChange && onChange(null, event);
            return;
        }

        const value = event.target.options[selectedIndex].value;

        onChange && onChange(value, this.props.name, event);
    }
}

Select.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    options: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
};

Select.defaultProps = {
    className: null,
    style: null,
    options: null,
    name: null,
    value: null,
    disabled: false,
    onChange: null,
};

export default Select;