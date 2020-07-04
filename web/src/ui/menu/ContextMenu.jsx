/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/ContextMenu.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 上下文菜单
 * @author tengge / https://github.com/tengge1
 */
class ContextMenu extends React.Component {
    render() {
        const { className, style, children } = this.props;

        return <ul
            className={classNames('ContextMenu', className)}
            style={style}
               >{children}</ul>;
    }
}

ContextMenu.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};

ContextMenu.defaultProps = {
    className: null,
    style: null,
    children: null
};

export default ContextMenu;