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