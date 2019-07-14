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

        this.state = {
            selected: props.selected,
        };

        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    handleChange(onChange, event) {
        var selected = event.target.classList.contains('selected');

        this.setState({
            selected: !selected,
        });
        onChange && onChange(!selected, event);
    }

    render() {
        const { className, style, selected, disabled, onChange, ...others } = this.props;

        return <div
            className={classNames('Toggle', this.state.selected && 'selected',
                disabled && 'disabled',
                className)}
            style={style}
            onClick={disabled ? null : this.handleChange}
            {...others}></div>;
    }
}

Toggle.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
};

Toggle.defaultProps = {
    className: null,
    style: null,
    selected: false,
    disabled: false,
    onChange: null,
};

export default Toggle;