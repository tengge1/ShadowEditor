import './css/TextureProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Input from '../form/Input.jsx';

/**
 * 纹理属性
 * @author tengge / https://github.com/tengge1
 */
class TextureProperty extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    render() {
        const { className, style, name, value } = this.props;

        return <Input
            className={classNames('TextureProperty', className)}
            style={style}
            name={name}
            value={value}
            onInput={this.handleChange}></Input>;
    }

    handleChange(onChange, value, name, event) {
        onChange && onChange(value, name, event);
    }
}

TextureProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

TextureProperty.defaultProps = {
    className: null,
    style: null,
    name: null,
    value: '',
    onChange: null,
};

export default TextureProperty;