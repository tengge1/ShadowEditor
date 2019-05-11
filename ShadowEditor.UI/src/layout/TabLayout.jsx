import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 选项卡布局
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} children 内容
 * @property {Integer} activeTab 激活选项卡
 */
class TabLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: props.activeTab,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        var tabIndex = event.target.tabIndex;
        this.setState({
            activeTab: tabIndex,
        });
    }

    render() {
        const { className, style, children } = this.props;
        const { activeTab } = this.state;

        return <div className={classNames('TabLayout', className)} style={style}>
            <div className={'tabs'}>
                {children.map((n, i) => {
                    return <div
                        className={classNames('tab', i === activeTab ? 'selected' : null)}
                        key={i}
                        tabIndex={i}
                        onClick={this.handleClick}
                    >{n.props.title}</div>;
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
};

TabLayout.defaultProps = {
    activeTab: 0,
};

export default TabLayout;