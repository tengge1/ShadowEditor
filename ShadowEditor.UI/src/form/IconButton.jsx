import './css/IconButton.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图标按钮
 * @author tengge / https://github.com/tengge1
 */
class IconButton extends React.Component {
    render() {
        const { className, style, icon, title, selected, onClick } = this.props;
        return <button
            className={classNames('IconButton', selected && 'selected', className)}
            style={style}
            title={title}
            onClick={onClick}>
            <i className={classNames('iconfont', icon && 'icon-' + icon)}></i>
        </button>;
    }
}

IconButton.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    icon: PropTypes.string,
    title: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
};

IconButton.defaultProps = {
    className: null,
    style: null,
    icon: null,
    title: null,
    selected: false,
    onClick: null,
};

export default IconButton;