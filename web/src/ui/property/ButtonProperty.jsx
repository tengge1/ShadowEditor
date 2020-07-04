/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
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
            className={classNames('button', className)}
            style={style}
            onClick={this.handleChange}
               >{text}</Button>;
    }

    handleChange(onChange, name, value, event) {
        onChange && onChange(name, value, event);
    }
}

ButtonProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    text: PropTypes.string,
    onChange: PropTypes.func
};

ButtonProperty.defaultProps = {
    className: null,
    style: null,
    text: 'Button',
    onChange: null
};

export default ButtonProperty;