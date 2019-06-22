import './css/ImageList.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图片列表
 * @author tengge / https://github.com/tengge1
 */
class ImageList extends React.Component {
    render() {
        const { className, style, ...others } = this.props;

        return <img
            className={classNames('ImageList', className)}
            style={style}
            {...others}></img>;
    }
}

ImageList.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

ImageList.defaultProps = {
    className: null,
    style: null,
};

export default ImageList;