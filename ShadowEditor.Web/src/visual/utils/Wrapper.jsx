import PropTypes from 'prop-types';

/**
 * 将SVG组件包裹起来
 */
class Wrapper extends React.Component {
    render() {
        const { children, ...others } = this.props;
        // eslint-disable-next-line
        return <React.Fragment {...others}>{children}</React.Fragment>;
    }
}

Wrapper.propTypes = {
    children: PropTypes.node
};

Wrapper.defaultProps = {
    children: null
};

export default Wrapper;