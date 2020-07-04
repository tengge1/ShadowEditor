/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/IconButton.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图标按钮
 * @author tengge / https://github.com/tengge1
 */
class IconButton extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const { className, style, icon, title, show, selected, disabled } = this.props;
        return <button
            className={classNames('IconButton', selected && 'selected', !show && 'hidden', disabled && 'disabled', className)}
            style={style}
            title={title}
            onClick={this.handleClick}
               >
            <i className={classNames('iconfont', icon && 'icon-' + icon)} />
        </button>;
    }

    handleClick(event) {
        const { name, disabled, onClick } = this.props;
        !disabled && onClick && onClick(name, event);
    }
}

IconButton.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    icon: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    show: PropTypes.bool,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func
};

IconButton.defaultProps = {
    className: null,
    style: null,
    icon: null,
    name: null,
    title: null,
    show: true,
    selected: false,
    disabled: false,
    onClick: null
};

export default IconButton;