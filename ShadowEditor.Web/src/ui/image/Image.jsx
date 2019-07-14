import './css/Image.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图片
 * @author tengge / https://github.com/tengge1
 */
class Image extends React.Component {
    render() {
        const { className, style, src, title } = this.props;

        return <img
            className={classNames('Image', className)}
            style={style}
            src={src}
            title={title}></img>;
    }
}

Image.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    src: PropTypes.string,
    title: PropTypes.string,
};

Image.defaultProps = {
    className: null,
    style: null,
    src: null,
    title: null,
};

export default Image;