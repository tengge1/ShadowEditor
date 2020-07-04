/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Canvas.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 画布
 * @author tengge / https://github.com/tengge1
 */
class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.dom = React.createRef();
    }

    render() {
        const { className, style, ...others } = this.props;

        return <canvas
            className={classNames('Canvas', className)}
            style={style}
            ref={this.dom}
            {...others}
               />;
    }
}

Canvas.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
};

Canvas.defaultProps = {
    className: null,
    style: null
};

export default Canvas;