import './css/DataGrid.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 数据表格
 * @author tengge / https://github.com/tengge1
 */
class DataGrid extends React.Component {
    render() {
        const { className, style } = this.props;

        return <div className={classNames('DataGrid', className)} style={style}>
        </div>;
    }
}

DataGrid.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

DataGrid.defaultProps = {
    className: null,
    style: null,
};

export default DataGrid;