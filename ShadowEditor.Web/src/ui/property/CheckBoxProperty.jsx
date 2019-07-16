import './css/CheckBoxProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import CheckBox from '../form/CheckBox.jsx';

/**
 * 复选框属性
 * @author tengge / https://github.com/tengge1
 */
class CheckBoxProperty extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    render() {
        const { className, style, name, value } = this.props;

        return <CheckBox
            className={classNames('CheckBoxProperty', className)}
            style={style}
            name={name}
            checked={value}
            onChange={this.handleChange}></CheckBox>;
    }

    handleChange(onChange, value, name, event) {
        onChange && onChange(value, name, event);
    }
}

CheckBoxProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.bool,
    onChange: PropTypes.func,
};

CheckBoxProperty.defaultProps = {
    className: null,
    style: null,
    name: null,
    value: false,
    onChange: null,
};

export default CheckBoxProperty;