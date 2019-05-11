import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 选项卡布局
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 * @property {Integer} activeTab 激活选项卡
 * @property {String} tabPosition 选项卡位置
 */
class TabLayout extends React.Component {
    render() {
        const { className, style, children, activeTab, tabPosition } = this.props;

        return <div className={classNames('TabLayout', tabPosition, className)} style={style}>
            <div className={'tabs'}>
                {children.map((n, i) => {
                    return <div className={classNames('tab', i === activeTab ? 'selected' : null)} key={i}>{n.props.title}</div>;
                })}
            </div>
            <div className={'contents'}>
                {children.map((n, i) => {
                    return <div className={classNames('content', i === activeTab ? 'show' : null)} key={i}>{n}</div>;
                })}
            </div>
        </div>;
    }
}

TabLayout.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.element,
    activeTab: PropTypes.number,
    tabPosition: PropTypes.oneOf([
        'top',
        'bottom',
        'left',
        'right',
    ]),
};

TabLayout.defaultProps = {
    activeTab: 0,
    tabPosition: 'top',
};

export default TabLayout;