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

        this.treeRef = React.createRef();

        const { onExpand, onSelect, onCheck, onDoubleClick, onDrop } = this.props;

        this.handleExpandNode = this.handleExpandNode.bind(this, onExpand);
        this.handleClick = this.handleClick.bind(this, onSelect);
        this.handleCheck = this.handleCheck.bind(this, onCheck);
        this.handleDoubleClick = this.handleDoubleClick.bind(this, onDoubleClick);

        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDragLeave = this.handleDragLeave.bind(this);
        this.handleDrop = this.handleDrop.bind(this, onDrop);
    }

    render() {
        const { className, style, data } = this.props;

        // 创建节点
        var list = [];

        Array.isArray(data) && data.forEach(n => {
            list.push(this.createNode(n));
        });

        return <ul className={classNames('Tree', className)} style={style} ref={this.treeRef}>{list}</ul>;
    }

    createNode(data) {
        const leaf = !data.children || data.children.length === 0;

        const children = leaf ? null : (<ul className={classNames('sub', data.expanded ? null : 'collpase')}>{data.children.map(n => {
            return this.createNode(n);
        })}</ul>);

        let checkbox = null;

        if (data.checked === true || data.checked === false) {
            checkbox = <CheckBox name={data.value} checked={data.checked} onChange={this.handleCheck} />;
        }

        return <li
            className={classNames('node', this.props.selected === data.value && 'selected')}
            value={data.value}
            key={data.value}
            onClick={this.handleClick}
            onDoubleClick={this.handleDoubleClick}
            draggable={'true'}
            droppable={'true'}
            onDrag={this.handleDrag}
            onDragStart={this.handleDragStart}
            onDragOver={this.handleDragOver}
            onDragLeave={this.handleDragLeave}
            onDrop={this.handleDrop}>
            <i className={classNames('expand', leaf ? null : (data.expanded ? 'minus' : 'plus'))} value={data.value} onClick={this.handleExpandNode}></i>
            {checkbox}
            <i className={classNames('type', leaf ? 'node' : (data.expanded ? 'open' : 'close'))}></i>
            <a href={'javascript:;'}>{data.text}</a>
            {leaf ? null : children}
        </li>;
    }

    // 暂时屏蔽树节点动画，有bug。
    // componentDidUpdate() {
    //     let tree = this.treeRef.current;

    //     // 将每棵子树设置高度，以便显示动画
    //     this.handleSetTreeHeight(tree);
    // }

    handleSetTreeHeight(node) {
        if (node.children.length === 0) {
            return;
        }

        let height = 0;

        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];

            height += child.offsetHeight;

            this.handleSetTreeHeight(child);
        }

        if (node.classList.contains('sub')) { // 子树
            node.style.height = `${height}px`;
        }
    }

    handleExpandNode(onExpand, event) {
        event.stopPropagation();
        const value = event.target.getAttribute('value');

        onExpand && onExpand(value, event);
    }

    handleClick(onSelect, event) {
        event.stopPropagation();
        var value = event.target.getAttribute('value');
        if (value) {
            onSelect && onSelect(value, event);
        }
    }

    handleCheck(onCheck, value, name, event) {
        event.stopPropagation();
        onCheck && onCheck(value, name, event);
    }

    handleDoubleClick(onDoubleClick, event) {
        var value = event.target.getAttribute('value');
        if (value) {
            onDoubleClick && onDoubleClick(value, event);
        }
    }

    // --------------------- 拖拽事件 ---------------------------

    handleDrag(event) {
        event.stopPropagation();
        this.currentDrag = event.currentTarget;
    }

    handleDragStart(event) {
        event.stopPropagation();
        event.dataTransfer.setData('text', 'foo');
    }

    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();

        var target = event.currentTarget;

        if (target === this.currentDrag) {
            return;
        }

        var area = event.nativeEvent.offsetY / target.clientHeight;

        if (area < 0.25) {
            target.classList.add('dragTop');
        } else if (area > 0.75) {
            target.classList.add('dragBottom');
        } else {
            target.classList.add('drag');
        }
    }

    handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();

        var target = event.currentTarget;

        if (target === this.currentDrag) {
            return;
        }

        target.classList.remove('dragTop');
        target.classList.remove('dragBottom');
        target.classList.remove('drag');
    }

    handleDrop(onDrop, event) {
        event.preventDefault();
        event.stopPropagation();

        var target = event.currentTarget;

        if (target === this.currentDrag) {
            return;
        }

        target.classList.remove('dragTop');
        target.classList.remove('dragBottom');
        target.classList.remove('drag');

        if (typeof (onDrop) === 'function') {
            const area = event.nativeEvent.offsetY / target.clientHeight;

            const currentValue = this.currentDrag.getAttribute('value');

            if (area < 0.25) { // 放在当前元素前面
                onDrop(
                    currentValue, // 拖动要素
                    target.parentNode.parentNode.getAttribute('value'), // 新位置父级
                    target.getAttribute('value'), // 新位置索引
                ); // 拖动, 父级, 索引
            } else if (area > 0.75) { // 放在当前元素后面
                onDrop(
                    currentValue,
                    target.parentNode.parentNode.getAttribute('value'),
                    target.nextSibling == null ? null : target.nextSibling.getAttribute('value'), // target.nextSibling为null，说明是最后一个位置
                );
            } else { // 成为该元素子级
                onDrop(
                    currentValue,
                    target.getAttribute('value'),
                    null,
                );
            }
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
    onCheck: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onDrop: PropTypes.func,
};

Tree.defaultProps = {
    className: null,
    style: null,
    data: [],
    selected: null,
    onExpand: null,
    onSelect: null,
    onCheck: null,
    onDoubleClick: null,
    onDrop: null,
};

export default Tree;