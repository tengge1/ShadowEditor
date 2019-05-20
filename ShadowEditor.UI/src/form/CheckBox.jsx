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
            selected: props.selected,
        };

        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    handleChange(onChange, event) {
        this.setState({
            selected: event.target.checked,
        });
        onChange && onChange(event.target.checked, event);
    }

    render() {
        const { className, style, disabled, onChange, ...others } = this.props;
        return <input
            type={'checkbox'}
            className={classNames('CheckBox', this.state.selected && 'selected', disabled && 'disabled', className)}
            style={style}
            defaultChecked={this.state.selected}
            disabled={disabled}
            onClick={this.handleChange}
            {...others} />;
    }
}

CheckBox.propTypes = {
    selected: PropTypes.bool,
    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.bool,
};

CheckBox.defaultProps = {
    selected: false,
    onChange: null,

    className: null,
    style: null,
    disabled: false,
};

export default CheckBox;