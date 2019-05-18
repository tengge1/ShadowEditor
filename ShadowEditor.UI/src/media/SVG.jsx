import './css/SVG.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * SVG
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class SVG extends React.Component {
    render() {
        const { className, style } = this.props;

        return <svg className={classNames('SVG', className)} style={style}></svg>;
    }
}

SVG.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default SVG;