/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/LoadMask.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 加载动画
 * @author tengge / https://github.com/tengge1
 */
class LoadMask extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style, show, text } = this.props;

        return <div className={classNames('LoadMask', className, !show && 'hidden')}
            style={style}
               >
            <div className={'box'}>
                <div className={'msg'}>{text}</div>
            </div>
        </div>;
    }
}

LoadMask.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool,
    text: PropTypes.string
};

LoadMask.defaultProps = {
    className: null,
    style: null,
    show: true,
    text: 'Waiting...'
};

export default LoadMask;