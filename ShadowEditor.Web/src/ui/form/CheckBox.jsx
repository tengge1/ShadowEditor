import './css/CheckBox.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 复选框
 * @author tengge / https://github.com/tengge1
 */
class CheckBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: props.checked,
        };

        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    handleChange(onChange, event) {
        const target = event.target;
        const name = target.getAttribute('name');
        const checked = target.checked;

        this.setState({ checked });

        onChange && onChange(name, checked, event);
    }

    render() {
        const { className, style, name, checked, disabled, onChange } = this.props;
        return <input
            type={'checkbox'}
            className={classNames('CheckBox', this.state.checked && 'checked', disabled && 'disabled', className)}
            style={style}
            name={name}
            defaultChecked={this.state.checked}
            disabled={disabled}
            onClick={this.handleChange} />;
    }
}

CheckBox.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
};

CheckBox.defaultProps = {
    className: null,
    style: null,
    name: undefined,
    checked: false,
    disabled: false,
    onChange: null,
};

export default CheckBox;