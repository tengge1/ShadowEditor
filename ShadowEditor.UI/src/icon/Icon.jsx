import './css/Icon.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 图标
 * @author tengge / https://github.com/tengge1
 */
class Icon extends React.Component {
    render() {
        const { className, style, icon, ...others } = this.props;

        return <i
            className={classNames('Icon', 'iconfont',
                icon && 'icon-' + icon,
                className)}
            style={style}
            {...others}></i>;
    }
}

Icon.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    icon: PropTypes.string,
};

Icon.defaultProps = {
    className: null,
    style: null,
    icon: null,
};

export default Icon;