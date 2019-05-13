import './css/Tree.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 树
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class Tree extends React.Component {
    render() {
        const { className, style } = this.props;

        return <div className={classNames('Tree', className)} style={style}>
            树
        </div>;
    }
}

Tree.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default Tree;