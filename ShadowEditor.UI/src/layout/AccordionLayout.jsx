import './css/AccordionLayout.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 折叠布局
 * @author tengge / https://github.com/tengge1
 */
class AccordionLayout extends React.Component {
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
        const { className, style, children, activeTab } = this.props;

        const _children = Array.isArray(children) ? children : [children];

        return <div className={classNames('AccordionLayout', className)} style={style}>
            <div className={'contents'}>
                {_children.map((n, i) => {
                    return <div className={classNames('content', i === this.state.activeTab ? 'show' : null)} key={i}>{n}</div>;
                })}
            </div>
        </div>;
    }
}

AccordionLayout.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    activeTab: PropTypes.number,
};

AccordionLayout.defaultProps = {
    className: null,
    style: null,
    children: null,
    activeTab: 0,
};

export default AccordionLayout;