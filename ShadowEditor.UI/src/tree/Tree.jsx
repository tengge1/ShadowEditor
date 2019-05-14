import './css/Tree.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 树
 * @author tengge / https://github.com/tengge1
 * @property {Array} data 数据
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class Tree extends React.Component {
    constructor(props) {
        super(props);
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
        const children = leaf ? null : (<ul className={'sub'}>{data.children.map(n => {
            return this.createNode(n);
        })}</ul>);

        return <li className={'node'} value={data.value} key={data.value}>
            <a href={'javascript:;'}>{data.text}</a>
            {leaf ? null : children}
        </li>;
    }
}

Tree.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default Tree;