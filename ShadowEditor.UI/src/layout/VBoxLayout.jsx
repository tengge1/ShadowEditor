import './css/VBoxLayout.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 竖直布局
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 * @property {String} region 区域
 */
class VBoxLayout extends React.Component {
    render() {
        const { className, style, children, region } = this.props;

        return <div className={classNames('VBoxLayout', region, className)} style={style}>{children}</div>;
    }
}

VBoxLayout.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.element,
    region: PropTypes.string,
};

VBoxLayout.defaultProps = {
    region: null,
};

export default VBoxLayout;