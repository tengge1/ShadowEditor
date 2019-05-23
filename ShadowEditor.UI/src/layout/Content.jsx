import './css/Content.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 内容
 * @author tengge / https://github.com/tengge1
 */
class Content extends React.Component {
    render() {
        const { className, style, children, ...others } = this.props;

        return <div
            className={classNames('Content', className)}
            style={style}
            {...others}>{children}</div>;
    }
}

Content.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
};

Content.defaultProps = {
    className: null,
    style: null,
    children: null,
};

export default Content;