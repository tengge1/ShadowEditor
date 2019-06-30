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
        this.setState({
            checked: event.target.checked,
        });
        onChange && onChange(event.target.checked, event);
    }

    render() {
        const { className, style, checked, disabled, onChange, ...others } = this.props;
        return <input
            type={'checkbox'}
            className={classNames('CheckBox', this.state.checked && 'checked', disabled && 'disabled', className)}
            style={style}
            defaultChecked={this.state.checked}
            disabled={disabled}
            onClick={this.handleChange}
            {...others} />;
    }
}

CheckBox.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
};

CheckBox.defaultProps = {
    className: null,
    style: null,
    checked: false,
    disabled: false,
    onChange: null,
};

export default CheckBox;