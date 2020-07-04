/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Video.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 视频查看器
 */
class Video extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this, props.onClick);
        this.handleClickImage = this.handleClickVideo.bind(this);
    }

    render() {
        const { className, style, url } = this.props;

        return <div className={classNames('VideoMark', className)}
            style={style}
            onClick={this.handleClick}
               >
            <video src={url}
                autoPlay={'autoplay'}
                controls={'controls'}
                onClick={this.handleClickVideo}
            />
        </div>;
    }

    handleClick(onClick, event) {
        onClick && onClick(event);
    }

    handleClickVideo(event) {
        event.stopPropagation();
    }
}

Video.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    url: PropTypes.string,
    onClick: PropTypes.func
};

Video.defaultProps = {
    className: null,
    style: null,
    url: null,
    onClick: null
};

export default Video;