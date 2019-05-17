import './css/DataGrid.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 数据表格
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
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

export default DataGrid;