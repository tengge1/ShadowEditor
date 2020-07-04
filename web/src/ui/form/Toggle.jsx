/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Toggle.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 开关
 * @author tengge / https://github.com/tengge1
 */
class Toggle extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { className, style, checked, disabled } = this.props;

        return <div
            className={classNames('Toggle', checked && 'checked',
                disabled && 'disabled',
                className)}
            style={style}
            onClick={disabled ? null : this.handleChange}
               />;
    }

    handleChange(event) {
        const { onChange } = this.props;

        var checked = event.target.classList.contains('checked');

        onChange && onChange(!checked, this.props.name, event);
    }
}

Toggle.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};

Toggle.defaultProps = {
    className: null,
    style: null,
    name: null,
    checked: false,
    disabled: false,
    onChange: null
};

export default Toggle;