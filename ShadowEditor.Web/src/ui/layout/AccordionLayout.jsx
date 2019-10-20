import './css/AccordionLayout.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import AccordionPanel from './private/AccordionPanel.jsx';

/**
 * 折叠布局
 * @author tengge / https://github.com/tengge1
 */
class AccordionLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeIndex: props.activeIndex,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(index, name, event) {
        const { onActive } = this.props;
        onActive && onActive(index, name, event);
        this.setState({
            activeIndex: index,
        });
    }

    render() {
        const { className, style, children } = this.props;

        const content = Array.isArray(children) ? children : [children];

        return <div className={classNames('AccordionLayout', className)} style={style}>
            {content.map((n, i) => {
                return <AccordionPanel
                    name={n.props.name}
                    title={n.props.title}
                    show={n.props.show}
                    total={content.length}
                    index={i}
                    collpased={i !== this.state.activeIndex}
                    maximizable={n.props.maximizable}
                    onClick={this.handleClick}
                    key={i}>{n.props.children}</AccordionPanel>;
            })}
        </div>;
    }
}

AccordionLayout.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    activeIndex: PropTypes.number,
    onActive: PropTypes.func,
};

AccordionLayout.defaultProps = {
    className: null,
    style: null,
    children: null,
    activeIndex: 0,
    onActive: null,
};

export default AccordionLayout;