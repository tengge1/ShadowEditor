import './css/IconButton.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图标按钮
 * @author tengge / https://github.com/tengge1
 */
class IconButton extends React.Component {
    render() {
        const { className, style, icon, selected, onClick, ...others } = this.props;
        return <button className={classNames('IconButton', selected && 'selected', className)} style={style} onClick={onClick} {...others}>
            <i className={classNames('iconfont', icon && 'icon-' + icon)}></i>
        </button>;
    }
}

IconButton.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    icon: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
};

IconButton.defaultProps = {
    className: null,
    style: null,
    icon: null,
    selected: false,
    onClick: null,
};

export default IconButton;