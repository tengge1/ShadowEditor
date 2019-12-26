import './css/Image.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图片
 * @author tengge / https://github.com/tengge1
 */
class Image extends React.Component {
    constructor(props) {
        super(props);

        this.handleError = this.handleError.bind(this);
    }

    render() {
        const { className, style, src, title } = this.props;

        return <img
            className={classNames('Image', className)}
            style={style}
            src={src}
            title={title}
            onError={this.handleError}
               />;
    }

    handleError(event) {
        let target = event.target;
        let parent = target.parentNode;
        parent.removeChild(target);

        let img = document.createElement('div');
        img.className = 'no-img';

        let icon = document.createElement('i');
        icon.className = 'Icon iconfont icon-scenes';
        img.appendChild(icon);

        let title = parent.children[0];
        parent.insertBefore(img, title);
    }
}

Image.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    src: PropTypes.string,
    title: PropTypes.string
};

Image.defaultProps = {
    className: null,
    style: null,
    src: null,
    title: null
};

export default Image;