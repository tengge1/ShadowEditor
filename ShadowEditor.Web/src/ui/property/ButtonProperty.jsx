import './css/ButtonProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Button from '../form/Button.jsx';

/**
 * 按钮属性
 * @author tengge / https://github.com/tengge1
 */
class ButtonProperty extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    render() {
        const { className, style, text } = this.props;

        return <Button
            className={classNames('ButtonProperty', className)}
            style={style}
            onClick={this.handleChange}>{text}</Button>;
    }

    handleChange(onChange, name, value, event) {
        onChange && onChange(name, value, event);
    }
}

ButtonProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    text: PropTypes.string,
    onChange: PropTypes.func,
};

ButtonProperty.defaultProps = {
    className: null,
    style: null,
    text: 'Button',
    onChange: null,
};

export default ButtonProperty;