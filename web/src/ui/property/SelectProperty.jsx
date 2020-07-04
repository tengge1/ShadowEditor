/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/SelectProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Select from '../form/Select.jsx';

/**
 * 文本属性
 * @author tengge / https://github.com/tengge1
 */
class SelectProperty extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this, props.onChange);
    }

    render() {
        const { className, style, options, name, value, disabled } = this.props;

        return <Select
            className={classNames('select', className)}
            style={style}
            options={options}
            name={name}
            value={value}
            disabled={disabled}
            onChange={this.handleChange}
               />;
    }

    handleChange(onChange, value, name, event) {
        onChange && onChange(value, name, event);
    }
}

SelectProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    options: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};

SelectProperty.defaultProps = {
    className: null,
    style: null,
    options: {},
    name: null,
    value: null,
    disabled: false,
    onChange: null
};

export default SelectProperty;