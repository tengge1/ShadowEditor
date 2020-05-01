import './css/TableCell.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 表格单元格
 * @author tengge / https://github.com/tengge1
 */
class TableCell extends React.Component {
    render() {
        const { className, style, children, ...others } = this.props;

        return <td
            className={classNames('TableCell', className)}
            style={style}
            {...others}
               >
            {children}
        </td>;
    }
}

TableCell.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};

TableCell.defaultProps = {
    className: null,
    style: null,
    children: null
};

export default TableCell;