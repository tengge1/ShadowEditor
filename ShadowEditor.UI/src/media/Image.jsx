import './css/Image.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图片
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class Image extends React.Component {
    render() {
        const { className, style } = this.props;

        return <img className={classNames('Image', className)} style={style}></img>;
    }
}

Image.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default Image;