import PropTypes from 'prop-types';

/**
 * SvgRect
 * @author tengge / https://github.com/tengge1
 */
class SvgRect extends React.Component {
    render() {
        const { x, y, width, height, children, ...others } = this.props;
        return <rect x={x}
            y={y}
            width={width}
            height={height}
            {...others}
               >{children}</rect>;
    }
}

SvgRect.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    children: PropTypes.node
};

SvgRect.defaultProps = {
    x: 50,
    y: 50,
    width: 100,
    height: 50,
    children: null
};

export default SvgRect;