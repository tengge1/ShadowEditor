/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Toolbar.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 工具栏
 * @author tengge / https://github.com/tengge1
 */
class Toolbar extends React.Component {
    render() {
        const { className, style, children, direction } = this.props;

        return <div
            className={classNames('Toolbar', direction, className)}
            style={style}
               >{children}</div>;
    }
}

Toolbar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    children: PropTypes.node
};

Toolbar.defaultProps = {
    className: null,
    style: null,
    direction: 'horizontal',
    children: null
};

export default Toolbar;