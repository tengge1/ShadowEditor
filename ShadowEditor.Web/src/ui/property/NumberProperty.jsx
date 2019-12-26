import './css/NumberProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Input from '../form/Input.jsx';

/**
 * 数字属性
 * @author tengge / https://github.com/tengge1
 */
class NumberProperty extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    render() {
        const { className, style, name, value, min, max, step } = this.props;

        return <Input
            className={classNames('input', className)}
            style={style}
            name={name}
            type={'number'}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={this.handleChange}
               />;
    }

    handleChange(onChange, value, name, event) {
        onChange && onChange(value, name, event);
    }
}

NumberProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    onChange: PropTypes.func
};

NumberProperty.defaultProps = {
    className: null,
    style: null,
    name: null,
    value: 0,
    min: null,
    max: null,
    step: null,
    onChange: null
};

export default NumberProperty;