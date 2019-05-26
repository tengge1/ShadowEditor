import './css/Image.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图片
 * @author tengge / https://github.com/tengge1
 */
class Image extends React.Component {
    render() {
        const { className, style, ...others } = this.props;

        return <img
            className={classNames('Image', className)}
            style={style}
            {...others}></img>;
    }
}

Image.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

Image.defaultProps = {
    className: null,
    style: null,
};

export default Image;