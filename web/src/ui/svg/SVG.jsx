/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/SVG.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * SVG
 * @author tengge / https://github.com/tengge1
 */
class SVG extends React.Component {
    render() {
        const { className, style, ...others } = this.props;

        return <svg
            className={classNames('SVG', className)}
            style={style}
            {...others}
               />;
    }
}

SVG.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
};

SVG.defaultProps = {
    className: null,
    style: null
};

export default SVG;