import './css/Canvas.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 画布
 * @author tengge / https://github.com/tengge1
 */
class Canvas extends React.Component {
    render() {
        const { className, style, ...others } = this.props;

        return <canvas
            className={classNames('Canvas', className)}
            style={style}
            {...others}></canvas>;
    }
}

Canvas.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

Canvas.defaultProps = {
    className: null,
    style: null,
};

export default Canvas;