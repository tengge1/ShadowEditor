import PropTypes from 'prop-types';

/**
 * SvgLine
 * @author tengge / https://github.com/tengge1
 */
class SvgLine extends React.Component {
    render() {
        const { x1, y1, x2, y2, children, ...others } = this.props;
        return <line x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            {...others}
               >{children}</line>;
    }
}

SvgLine.propTypes = {
    x1: PropTypes.number,
    y1: PropTypes.number,
    x2: PropTypes.number,
    y2: PropTypes.number,
    children: PropTypes.node
};

SvgLine.defaultProps = {
    x1: 0,
    y1: 80,
    x2: 100,
    y2: 20,
    children: null
};

export default SvgLine;