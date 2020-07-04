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
 * SvgPolyline
 * @author tengge / https://github.com/tengge1
 */
class SvgPolyline extends React.Component {
    render() {
        const { points, children, ...others } = this.props;
        return <polyline points={points}
            {...others}
               >{children}</polyline>;
    }
}

SvgPolyline.propTypes = {
    polyline: PropTypes.string,
    children: PropTypes.node
};

SvgPolyline.defaultProps = {
    points: '100,100 150,25 150,75 200,0',
    children: null
};

export default SvgPolyline;