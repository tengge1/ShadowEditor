import './css/Radio.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 单选框
 * @author tengge / https://github.com/tengge1
 */
class Radio extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    render() {
        const { className, style, checked, disabled } = this.props;
        return <input type={'radio'}
            className={classNames('Radio', checked && 'checked', disabled && 'disabled', className)}
            style={style}
            checked={checked}
            disabled={disabled}
            onChange={this.handleChange} />;
    }

    handleChange(onChange, event) {
        onChange && onChange(event.target.checked, this.props.name, event);
    }
}

Radio.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
};

Radio.defaultProps = {
    className: null,
    style: null,
    name: null,
    checked: false,
    disabled: false,
    onChange: null,
};

export default Radio;