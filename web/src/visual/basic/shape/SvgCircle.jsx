/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import PropTypes from 'prop-types';

/**
 * SvgCircle
 * @author tengge / https://github.com/tengge1
 */
class SvgCircle extends React.Component {
    render() {
        const { cx, cy, r, children, ...others } = this.props;
        return <circle cx={cx}
            cy={cy}
            r={r}
            {...others}
               >{children}</circle>;
    }
}

SvgCircle.propTypes = {
    cx: PropTypes.number,
    cy: PropTypes.number,
    r: PropTypes.number,
    children: PropTypes.node
};

SvgCircle.defaultProps = {
    cx: 50,
    cy: 50,
    r: 50,
    children: null
};

export default SvgCircle;