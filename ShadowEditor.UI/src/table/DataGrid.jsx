import './css/DataGrid.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 数据表格
 * @author tengge / https://github.com/tengge1
 */
class DataGrid extends React.Component {
    render() {
        const { className, style, children, data } = this.props;

        return <table className={classNames('DataGrid', className)} style={style}>
        </table>;
    }
}

DataGrid.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    data: PropTypes.array,
};

DataGrid.defaultProps = {
    className: null,
    style: null,
    children: null,
    data: [],
};

export default DataGrid;