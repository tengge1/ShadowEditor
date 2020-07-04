/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Button.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 按钮
 * @author tengge / https://github.com/tengge1
 */
class Button extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const { className, style, children, color, disabled, show } = this.props;

        return <button
            className={classNames('Button', color, disabled && 'disabled', !show && 'hidden', className)}
            style={style}
            disabled={disabled}
            onClick={this.handleClick}
               >
            {children}
        </button>;
    }

    handleClick(event) {
        const { name, disabled, onClick } = this.props;
        !disabled && onClick && onClick(name, event);
    }
}

Button.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    children: PropTypes.node,
    color: PropTypes.oneOf(['primary', 'success', 'warn', 'danger']),
    disabled: PropTypes.bool,
    show: PropTypes.bool,
    onClick: PropTypes.func
};

Button.defaultProps = {
    className: null,
    style: null,
    name: null,
    children: null,
    color: null,
    disabled: false,
    show: true,
    onClick: null
};

export default Button;