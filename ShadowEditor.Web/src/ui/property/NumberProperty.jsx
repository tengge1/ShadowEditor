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
        const { className, style, name, value } = this.props;

        return <Input
            className={classNames('NumberProperty', className)}
            style={style}
            name={name}
            type={'number'}
            value={value.toString()}
            onInput={this.handleChange}></Input>;
    }

    handleChange(onChange, value) {
        onChange && onChange(value);
    }
}

NumberProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.number,
    onChange: PropTypes.func,
};

NumberProperty.defaultProps = {
    className: null,
    style: null,
    name: null,
    value: 0,
    onChange: null,
};

export default NumberProperty;