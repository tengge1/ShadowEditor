import './css/Button.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 按钮
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 * @property {Function} onClick 点击事件
 */
class Button extends React.Component {
    render() {
        const { className, style, children, onClick } = this.props;
        return <button className={classNames('Button', className)} style={style} onClick={onClick}>
            {children}
        </button>;
    }
}

Button.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.element,
    onClick: PropTypes.func,
};

Button.defaultProps = {
    children: '',
};

export default Button;