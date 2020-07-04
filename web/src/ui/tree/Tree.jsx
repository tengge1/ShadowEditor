/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Tree.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import CheckBox from '../form/CheckBox.jsx';
import Icon from '../icon/Icon.jsx';
import LoadMask from '../progress/LoadMask.jsx';

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
        this.handleClickIcon = this.handleClickIcon.bind(this, props.onClickIcon);

        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDragLeave = this.handleDragLeave.bind(this);
        this.handleDrop = this.handleDrop.bind(this, onDrop);
    }

    render() {
        const { className, style, data, mask } = this.props;

        // 创建节点
        let list = [];

        Array.isArray(data) && data.forEach(n => {
            list.push(this.createNode(n));
        });

        return <div className={'TreeWrap'}>
            <ul className={classNames('Tree', className)}
                style={style}
                ref={this.treeRef}
            >{list}</ul>
            <LoadMask text={_t('Loading...')}
                show={mask}
            />
        </div>;
    }

    createNode(data) {
        // TODO: leaf应该根据数据上的left属性判断，而不是children。
        const leaf = (!data.children || data.children.length === 0) && data.leaf !== false;

        const children = data.children && data.children.length > 0 ? <ul className={classNames('sub', data.expanded ? null : 'collpase')}>{data.children.map(n => {
            return this.createNode(n);
        })}</ul> : null;

        let checkbox = null;

        if (data.checked === true || data.checked === false) {
            checkbox = <CheckBox name={data.value}
                checked={data.checked}
                onChange={this.handleCheck}
                       />;
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
            onDrop={this.handleDrop}
               >
            <i className={classNames('expand', leaf ? null : data.expanded ? 'minus' : 'plus')}
                value={data.value}
                onClick={this.handleExpandNode}
            />
            {checkbox}
            <i className={classNames('type', leaf ? 'leaf' : data.expanded ? 'open' : 'close')} />
            <a href={'javascript:;'}>{data.text}</a>
            {data.icons && data.icons.map(n => {
                return <Icon className={'control'}
                    name={n.name}
                    value={data.value}
                    icon={n.icon}
                    title={n.title}
                    key={n.name}
                    onClick={this.handleClickIcon}
                       />;
            })}
            {leaf ? null : children}
        </li>;
    }

    // 暂时屏蔽树节点动画，有bug。
    // componentDidUpdate() {
    //     let tree = this.treeRef.current;

    //     // 将每棵子树设置高度，以便显示动画
    //     this.handleSetTreeHeight(tree);
    // }

    // handleSetTreeHeight(node) {
    //     if (node.children.length === 0) {
    //         return;
    //     }

    //     let height = 0;

    //     for (let i = 0; i < node.children.length; i++) {
    //         let child = node.children[i];

    //         height += child.offsetHeight;

    //         this.handleSetTreeHeight(child);
    //     }

    //     if (node.classList.contains('sub')) { // 子树
    //         node.style.height = `${height}px`;
    //     }
    // }

    /**
     * 将某个节点滚动到视野范围内
     * @param {*} value 节点的值
     */
    scrollToView(value) {
        let root = this.treeRef.current;
        if (!root) {
            return;
        }

        let node = this.findNode(value, root);

        if (!node) {
            return;
        }

        const treeHeight = root.clientHeight;
        const treeTop = root.scrollTop;

        const nodeHeight = node.clientHeight;
        const offsetTop = node.offsetTop;

        const minScrollTop = offsetTop + nodeHeight - treeHeight;
        const maxScrollTop = offsetTop;

        if (treeTop >= minScrollTop && treeTop <= maxScrollTop) { // 不需要滚动
            return;
        } else if (treeTop < minScrollTop) {
            root.scrollTop = minScrollTop;
        } else if (treeTop > maxScrollTop) {
            root.scrollTop = maxScrollTop;
        }
    }

    findNode(value, node) {
        const _value = node.getAttribute('value');
        if (value === _value) {
            return node;
        }
        for (let child of node.children) {
            const _node = this.findNode(value, child);
            if (_node) {
                return _node;
            }
        }
    }

    handleExpandNode(onExpand, event) {
        event.stopPropagation();
        const value = event.target.getAttribute('value');

        onExpand && onExpand(value, event);
    }

    handleClick(onSelect, event) {
        event.stopPropagation();
        let value = event.target.getAttribute('value');
        if (value) {
            onSelect && onSelect(value, event);
        }
    }

    handleCheck(onCheck, value, name, event) {
        event.stopPropagation();
        onCheck && onCheck(value, name, event);
    }

    handleDoubleClick(onDoubleClick, event) {
        const value = event.target.getAttribute('value');

        if (value) {
            onDoubleClick && onDoubleClick(value, event);
        }
    }

    handleClickIcon(onClickIcon, name, event) {
        const value = event.target.getAttribute('value');

        event.stopPropagation();

        onClickIcon && onClickIcon(value, name, event);
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

        let target = event.currentTarget;

        if (target === this.currentDrag) {
            return;
        }

        let area = event.nativeEvent.offsetY / target.clientHeight;

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

        let target = event.currentTarget;

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

        let target = event.currentTarget;

        if (target === this.currentDrag) {
            return;
        }

        target.classList.remove('dragTop');
        target.classList.remove('dragBottom');
        target.classList.remove('drag');

        if (typeof onDrop === 'function') {
            const area = event.nativeEvent.offsetY / target.clientHeight;

            const currentValue = this.currentDrag.getAttribute('value');

            if (area < 0.25) { // 放在当前元素前面
                onDrop(
                    currentValue, // 拖动要素
                    target.parentNode.parentNode.getAttribute('value'), // 新位置父级
                    target.getAttribute('value') // 新位置索引
                ); // 拖动, 父级, 索引
            } else if (area > 0.75) { // 放在当前元素后面
                onDrop(
                    currentValue,
                    target.parentNode.parentNode.getAttribute('value'),
                    !target.nextSibling ? null : target.nextSibling.getAttribute('value') // target.nextSibling为null，说明是最后一个位置
                );
            } else { // 成为该元素子级
                onDrop(
                    currentValue,
                    target.getAttribute('value'),
                    null
                );
            }
        }
    }
}

Tree.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.array,
    mask: PropTypes.bool,
    selected: PropTypes.string,
    onExpand: PropTypes.func,
    onSelect: PropTypes.func,
    onCheck: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onClickIcon: PropTypes.func,
    onDrop: PropTypes.func
};

Tree.defaultProps = {
    className: null,
    style: null,
    data: [],
    mask: false,
    selected: null,
    onExpand: null,
    onSelect: null,
    onCheck: null,
    onDoubleClick: null,
    onClickIcon: null,
    onDrop: null
};

export default Tree;