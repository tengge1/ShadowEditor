import PropTypes from 'prop-types';

/**
 * SvgPath
 * @author tengge / https://github.com/tengge1
 */
class SvgPath extends React.Component {
    render() {
        const { d, children, ...others } = this.props;
        return <path d={d}
            {...others}
               >{children}</path>;
    }
}

SvgPath.propTypes = {
    d: PropTypes.string,
    children: PropTypes.node
};

SvgPath.defaultProps = {
    d: 'M 100 100 L 300 100 L 200 300 z',
    children: null
};

export default SvgPath;