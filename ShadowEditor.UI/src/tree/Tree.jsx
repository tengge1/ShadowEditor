import './css/Tree.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 树
 * @author tengge / https://github.com/tengge1
 */
class Tree extends React.Component {
    constructor(props) {
        super(props);

        const { data, onExpand, onSelect } = this.props;

        var expanded = {};

        this._traverseNode(data, node => {
            if (node.expand) {
                expanded[node.value] = true;
            }
        });

        this.state = {
            selected: null,
            expanded: expanded,
        };

        this.handleExpandNode = this.handleExpandNode.bind(this, onExpand);
        this.handleClick = this.handleClick.bind(this, onSelect);
    }

    _traverseNode(list, callback) {
        list.forEach(n => {
            callback && callback(n);
            Array.isArray(n.children) && this._traverseNode(n.children, callback);
        });
    }

    handleExpandNode(onExpand, event) {
        event.stopPropagation();
        var value = event.target.getAttribute('value');

        var expanded = Object.assign({}, this.state.expanded);
        if (!expanded[value]) {
            expanded[value] = true;
            onExpand && onExpand(value, true, event);
        } else {
            delete expanded[value];
            onExpand && onExpand(value, false, event);
        }

        this.setState({
            expanded: expanded,
        });
    }

    handleClick(onSelect, event) {
        var value = event.target.getAttribute('value');
        if (value) {
            onSelect && onSelect(value, event);

            this.setState({
                selected: value,
            });
        }
    }

    render() {
        const { data, className, style } = this.props;

        var list = [];

        Array.isArray(data) && data.forEach(n => {
            list.push(this.createNode(n));
        });

        return <ul className={classNames('Tree', className)} style={style}>{list}</ul>;
    }

    createNode(data) {
        const leaf = !data.children || data.children.length === 0;

        const expanded = this.state.expanded;

        const children = leaf ? null : (<ul className={classNames('sub', expanded[data.value] ? null : 'collpase')}>{data.children.map(n => {
            return this.createNode(n);
        })}</ul>);

        return <li className={classNames('node', this.state.selected === data.value && 'selected')} value={data.value} key={data.value} onClick={this.handleClick}>
            <i className={classNames('expand', leaf ? null : (expanded[data.value] ? 'minus' : 'plus'))} value={data.value} onClick={this.handleExpandNode}></i>
            <i className={classNames('type', leaf ? 'node' : (expanded[data.value] ? 'open' : 'close'))}></i>
            <a href={'javascript:;'}>{data.text}</a>
            {leaf ? null : children}
        </li>;
    }
}

Tree.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.array,
    onExpand: PropTypes.func,
    onSelect: PropTypes.func,
};

Tree.defaultProps = {
    className: null,
    style: null,
    data: [],
    onExpand: null,
    onSelect: null,
};

export default Tree;