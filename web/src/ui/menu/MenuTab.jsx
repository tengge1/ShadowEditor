/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/MenuTab.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 菜单选项卡
 * @author tengge / https://github.com/tengge1
 */
class MenuTab extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this, props.onClick);
    }

    render() {
        const { className, style, children, selected, show, disabled } = this.props;

        return <li
            className={classNames('MenuTab', selected && 'selected', disabled && 'disabled', !show && 'hidden', className)}
            style={style}
            onClick={this.handleClick}
               >{children}</li>;
    }

    handleClick(onClick, event) {
        event.stopPropagation();

        if (!event.target.classList.contains('disabled')) {
            onClick && onClick(this.props.name, event);
        }
    }
}

MenuTab.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    name: PropTypes.string,
    selected: PropTypes.bool,
    show: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func
};

MenuTab.defaultProps = {
    className: null,
    style: null,
    children: null,
    name: null,
    selected: false,
    show: true,
    disabled: false,
    onClick: null
};

export default MenuTab;