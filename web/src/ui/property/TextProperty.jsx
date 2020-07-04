/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/TextProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Input from '../form/Input.jsx';

/**
 * 文本属性
 * @author tengge / https://github.com/tengge1
 */
class TextProperty extends React.Component {
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
            value={value}
            onChange={this.handleChange}
               />;
    }

    handleChange(onChange, value, name, event) {
        onChange && onChange(value, name, event);
    }
}

TextProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

TextProperty.defaultProps = {
    className: null,
    style: null,
    name: null,
    value: '',
    onChange: null
};

export default TextProperty;