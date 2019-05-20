import './css/Button.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 按钮
 * @author tengge / https://github.com/tengge1
 */
class Button extends React.Component {
    render() {
        const { className, style, children, ...others } = this.props;
        return <button className={classNames('Button', className)} style={style} {...others}>
            {children}
        </button>;
    }
}

Button.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.element,
};

Button.defaultProps = {
    className: null,
    style: null,
    children: null,
};

export default Button;