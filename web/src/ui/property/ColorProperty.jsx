import './css/ColorProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Input from '../form/Input.jsx';

/**
 * 颜色属性
 * @author tengge / https://github.com/tengge1
 */
class ColorProperty extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    render() {
        const { className, style, name, value } = this.props;

        return <Input
            className={classNames('input', className)}
            style={style}
            name={name}
            type={'color'}
            value={value}
            onChange={this.handleChange}
               />;
    }

    handleChange(onChange, value, name, event) {
        onChange && onChange(value, name, event);
    }
}

ColorProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

ColorProperty.defaultProps = {
    className: null,
    style: null,
    name: null,
    value: '',
    onChange: null
};

export default ColorProperty;