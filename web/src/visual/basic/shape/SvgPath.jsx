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
 * SvgPath
 * @author tengge / https://github.com/tengge1
 */
class SvgPath extends React.Component {
    render() {
        const { d, children, ...others } = this.props;
        return <path d={d}
            {...others}
               >{children}</path>;
    }
}

SvgPath.propTypes = {
    d: PropTypes.string,
    children: PropTypes.node
};

SvgPath.defaultProps = {
    d: 'M 100 100 L 300 100 L 200 300 z',
    children: null
};

export default SvgPath;