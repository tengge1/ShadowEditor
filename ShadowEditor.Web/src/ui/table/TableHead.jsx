import './css/TableHead.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 表格头部
 * @author tengge / https://github.com/tengge1
 */
class TableHead extends React.Component {
    render() {
        const { className, style, children, ...others } = this.props;

        return <thead
            className={classNames('TableHead', className)}
            style={style}
            {...others}
               >
            {children}
        </thead>;
    }
}

TableHead.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};

TableHead.defaultProps = {
    className: null,
    style: null,
    children: null
};

export default TableHead;