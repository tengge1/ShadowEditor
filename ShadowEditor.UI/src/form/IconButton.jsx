import './css/IconButton.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图标按钮
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 * @property {Function} onClick 点击事件
 */
class IconButton extends React.Component {
    render() {
        const { className, style, children, onClick } = this.props;
        return <button className={classNames('IconButton', className)} style={style} onClick={onClick}>
            {children}
        </button>;
    }
}

IconButton.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.element,
    onClick: PropTypes.func,
};

export default IconButton;