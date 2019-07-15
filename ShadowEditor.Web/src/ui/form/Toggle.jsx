import './css/Toggle.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 开关
 * @author tengge / https://github.com/tengge1
 */
class Toggle extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    render() {
        const { className, style, checked, disabled, onChange } = this.props;

        return <div
            className={classNames('Toggle', this.state.checked && 'checked',
                disabled && 'disabled',
                className)}
            style={style}
            onClick={disabled ? null : this.handleChange}></div>;
    }

    handleChange(onChange, event) {
        var checked = event.target.classList.contains('checked');

        onChange && onChange(!checked, this.props.name, event);
    }
}

Toggle.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
};

Toggle.defaultProps = {
    className: null,
    style: null,
    name: null,
    checked: false,
    disabled: false,
    onChange: null,
};

export default Toggle;