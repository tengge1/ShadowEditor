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
 * SvgEllipse
 * @author tengge / https://github.com/tengge1
 */
class SvgEllipse extends React.Component {
    render() {
        const { cx, cy, rx, ry, children, ...others } = this.props;
        return <ellipse cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            {...others}
               >{children}</ellipse>;
    }
}

SvgEllipse.propTypes = {
    cx: PropTypes.number,
    cy: PropTypes.number,
    rx: PropTypes.number,
    ry: PropTypes.number,
    children: PropTypes.node
};

SvgEllipse.defaultProps = {
    cx: 100,
    cy: 50,
    rx: 100,
    ry: 50,
    children: null
};

export default SvgEllipse;