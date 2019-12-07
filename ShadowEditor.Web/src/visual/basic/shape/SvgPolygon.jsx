import PropTypes from 'prop-types';

/**
 * SvgPolygon
 * @author tengge / https://github.com/tengge1
 */
class SvgPolygon extends React.Component {
    render() {
        const { points, children, ...others } = this.props;
        return <polygon points={points}
            {...others}
               >{children}</polygon>;
    }
}

SvgPolygon.propTypes = {
    points: PropTypes.string,
    children: PropTypes.node
};

SvgPolygon.defaultProps = {
    points: '0,100 50,25 50,75 100,0',
    children: null
};

export default SvgPolygon;