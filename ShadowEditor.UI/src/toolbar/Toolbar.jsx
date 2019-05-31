import './css/Toolbar.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 工具栏
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} direction 方向：horizontal, vertical
 * @property {String} children 内容
 * @property {String} region 区域
 */
class Toolbar extends React.Component {
    render() {
        const { className, style, direction, children, region } = this.props;

        return <div className={classNames('Toolbar', direction, region, className)}>{children}</div>;
    }
}

Toolbar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    children: PropTypes.node,
    region: PropTypes.string,
};

Toolbar.defaultProps = {
    direction: 'horizontal',
    region: null,
};

export default Toolbar;