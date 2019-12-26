import './css/AbsoluteLayout.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 绝对定位布局
 * @author tengge / https://github.com/tengge1
 */
class AbsoluteLayout extends React.Component {
    render() {
        const { className, style, children, left, top, ...others } = this.props;

        const position = {
            left: left || 0,
            top: top || 0
        };

        return <div
            className={classNames('AbsoluteLayout', className)}
            style={style ? Object.assign({}, style, position) : position}
            {...others}
               >{children}</div>;
    }
}

AbsoluteLayout.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    left: PropTypes.string,
    top: PropTypes.string
};

AbsoluteLayout.defaultProps = {
    className: null,
    style: null,
    children: null,
    left: '0',
    top: '0'
};

export default AbsoluteLayout;