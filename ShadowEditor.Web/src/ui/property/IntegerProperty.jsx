import './css/IntegerProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Input from '../form/Input.jsx';

/**
 * 整数属性
 * @author tengge / https://github.com/tengge1
 */
class IntegerProperty extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    render() {
        const { className, style, name, value } = this.props;

        return <Input
            className={classNames('IntegerProperty', className)}
            style={style}
            name={name}
            type={'number'}
            value={value}
            onInput={this.handleChange}></Input>;
    }

    handleChange(onChange, value, name, event) {
        if (value === null) {
            onChange && onChange(value, name, event);
        } else {
            onChange && onChange(parseInt(value), name, event);
        }
    }
}

IntegerProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.number,
    onChange: PropTypes.func,
};

IntegerProperty.defaultProps = {
    className: null,
    style: null,
    name: null,
    value: 0,
    onChange: null,
};

export default IntegerProperty;