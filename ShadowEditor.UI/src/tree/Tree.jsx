import './css/Tree.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import CheckBox from '../form/CheckBox.jsx';

/**
 * 树
 * @author tengge / https://github.com/tengge1
 */
class Tree extends React.Component {
    constructor(props) {
        super(props);

        const { onExpand, onSelect, onDoubleClick } = this.props;

        this.handleExpandNode = this.handleExpandNode.bind(this, onExpand);
        this.handleClick = this.handleClick.bind(this, onSelect);
        this.handleDoubleClick = this.handleDoubleClick.bind(this, onDoubleClick);
    }

    render() {
        const { data, className, style } = this.props;

        // 创建节点
        var list = [];

        Array.isArray(data) && data.forEach(n => {
            list.push(this.createNode(n));
        });

        return <ul className={classNames('Tree', className)} style={style}>{list}</ul>;
    }

    createNode(data) {
        const leaf = !data.children || data.children.length === 0;

        const children = leaf ? null : (<ul className={classNames('sub', data.expanded ? null : 'collpase')}>{data.children.map(n => {
            return this.createNode(n);
        })}</ul>);

        let checkbox = null;

        if (data.checked === true || data.checked === false) {
            checkbox = <CheckBox selected={data.checked} />;
        }

        return <li
            className={classNames('node', this.props.selected === data.value && 'selected')}
            value={data.value}
            key={data.value}
            onClick={this.handleClick}
            onDoubleClick={this.handleDoubleClick}>
            <i className={classNames('expand', leaf ? null : (data.expanded ? 'minus' : 'plus'))} value={data.value} onClick={this.handleExpandNode}></i>
            {checkbox}
            <i className={classNames('type', leaf ? 'node' : (data.expanded ? 'open' : 'close'))}></i>
            <a href={'javascript:;'}>{data.text}</a>
            {leaf ? null : children}
        </li>;
    }

    handleExpandNode(onExpand, event) {
        event.stopPropagation();
        const value = event.target.getAttribute('value');

        onExpand && onExpand(value, event);
    }

    handleClick(onSelect, event) {
        var value = event.target.getAttribute('value');
        if (value) {
            onSelect && onSelect(value, event);
        }
    }

    handleDoubleClick(onDoubleClick, event) {
        var value = event.target.getAttribute('value');
        if (value) {
            onDoubleClick && onDoubleClick(value, event);
        }
    }
}

Tree.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.array,
    selected: PropTypes.string,
    onExpand: PropTypes.func,
    onSelect: PropTypes.func,
    onDoubleClick: PropTypes.func,
};

Tree.defaultProps = {
    className: null,
    style: null,
    data: [],
    selected: null,
    onExpand: null,
    onSelect: null,
    onDoubleClick: null,
};

export default Tree;