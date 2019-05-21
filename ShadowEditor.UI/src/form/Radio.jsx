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
        const { className, style, selected, disabled, onChange, ...others } = this.props;
        return <input
            type={'radio'}
            className={classNames('Radio',
                this.state.selected && 'selected',
                disabled && 'disabled',
                className)}
            style={style}
            defaultChecked={this.state.selected}
            disabled={disabled}
            onClick={this.handleChange}
            {...others} />;
    }
}

Radio.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
};

Radio.defaultProps = {
    className: null,
    style: null,
    selected: false,
    disabled: false,
    onChange: null,
};

export default Radio;