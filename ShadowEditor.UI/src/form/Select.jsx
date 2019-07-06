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

    handleChange(onChange, event) {
        const selectedIndex = event.target.selectedIndex;

        if (selectedIndex === -1) {
            onChange && onChange(null, event);
            return;
        }

        const value = event.target.options[selectedIndex].value;

        onChange && onChange(value, event);
    }

    render() {
        const { className, style, options, value, onChange } = this.props;

        return <select
            className={classNames('Select', className)}
            style={style}
            value={value}
            onChange={this.handleChange}>
            {options && Object.keys(options).map(n => {
                return <option value={n} key={n}>{options[n]}</option>;
            })}
        </select>;
    }
}

Select.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    options: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

Select.defaultProps = {
    className: null,
    style: null,
    options: null,
    value: null,
    onChange: null,
};

export default Select;