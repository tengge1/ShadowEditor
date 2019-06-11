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

        const { data } = this.props;

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

        this.handleExpandNode = this.handleExpandNode.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    _traverseNode(list, callback) {
        list.forEach(n => {
            callback && callback(n);
            Array.isArray(n.children) && this._traverseNode(n.children, callback);
        });
    }

    handleExpandNode(event) {
        var value = event.target.getAttribute('value');

        var expanded = Object.assign({}, this.state.expanded);
        if (!expanded[value]) {
            expanded[value] = true;
        } else {
            delete expanded[value];
        }

        this.setState({
            expanded: expanded,
        });
    }

    handleClick(event) {
        var value = event.target.getAttribute('value');
        if (value) {
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

        const children = leaf ? null : (<ul className={classNames('sub', expanded[data.value] ? null : 'hide')}>{data.children.map(n => {
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
};

Tree.defaultProps = {
    className: null,
    style: null,
};

export default Tree;