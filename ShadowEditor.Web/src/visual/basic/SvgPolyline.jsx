import PropTypes from 'prop-types';

/**
 * SvgPolyline
 * @author tengge / https://github.com/tengge1
 */
class SvgPolyline extends React.Component {
    render() {
        const { points, children, ...others } = this.props;
        return <polyline points={points}
            {...others}
               >{children}</polyline>;
    }
}

SvgPolyline.propTypes = {
    polyline: PropTypes.string,
    children: PropTypes.node
};

SvgPolyline.defaultProps = {
    points: '100,100 150,25 150,75 200,0',
    children: null
};

export default SvgPolyline;