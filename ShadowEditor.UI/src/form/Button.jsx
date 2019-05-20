import './css/Button.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 按钮
 * @author tengge / https://github.com/tengge1
 */
class Button extends React.Component {
    render() {
        const { className, style, children, color, disabled, ...others } = this.props;
        return <button className={classNames('Button', color, disabled && 'disabled', className)} style={style} disabled={disabled && 'disabled'} {...others}>
            {children}
        </button>;
    }
}

Button.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    color: PropTypes.oneOf(['primary', 'success', 'warn', 'danger']),
    disabled: PropTypes.bool,
};

Button.defaultProps = {
    className: null,
    style: null,
    children: null,
    color: null,
    disabled: false,
};

export default Button;