/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
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
            className={classNames('checkbox', className)}
            style={style}
            name={name}
            checked={value}
            onChange={this.handleChange}
               />;
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
    onChange: PropTypes.func
};

CheckBoxProperty.defaultProps = {
    className: null,
    style: null,
    name: null,
    value: false,
    onChange: null
};

export default CheckBoxProperty;