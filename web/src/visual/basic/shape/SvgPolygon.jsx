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
 * SvgPolygon
 * @author tengge / https://github.com/tengge1
 */
class SvgPolygon extends React.Component {
    render() {
        const { points, children, ...others } = this.props;
        return <polygon points={points}
            {...others}
               >{children}</polygon>;
    }
}

SvgPolygon.propTypes = {
    points: PropTypes.string,
    children: PropTypes.node
};

SvgPolygon.defaultProps = {
    points: '0,100 50,25 50,75 100,0',
    children: null
};

export default SvgPolygon;