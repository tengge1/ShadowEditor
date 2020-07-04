/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/AbsoluteLayout.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 绝对定位布局
 * @author tengge / https://github.com/tengge1
 */
class AbsoluteLayout extends React.Component {
    render() {
        const { className, style, children, left, top, ...others } = this.props;

        const position = {
            left: left || 0,
            top: top || 0
        };

        return <div
            className={classNames('AbsoluteLayout', className)}
            style={style ? Object.assign({}, style, position) : position}
            {...others}
               >{children}</div>;
    }
}

AbsoluteLayout.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    left: PropTypes.string,
    top: PropTypes.string
};

AbsoluteLayout.defaultProps = {
    className: null,
    style: null,
    children: null,
    left: '0',
    top: '0'
};

export default AbsoluteLayout;