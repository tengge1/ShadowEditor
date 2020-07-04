/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
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
        const { className, style, name, value, min, max } = this.props;

        return <Input
            className={classNames('input', className)}
            style={style}
            name={name}
            type={'number'}
            value={value}
            min={min}
            max={max}
            step={1}
            precision={0}
            onChange={this.handleChange}
               />;
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
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func
};

IntegerProperty.defaultProps = {
    className: null,
    style: null,
    name: null,
    value: 0,
    min: null,
    max: null,
    onChange: null
};

export default IntegerProperty;