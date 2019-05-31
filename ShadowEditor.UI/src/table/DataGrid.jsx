import './css/DataGrid.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Column from '../common/Column.jsx';
import Columns from '../common/Columns.jsx';

/**
 * 数据表格
 * @author tengge / https://github.com/tengge1
 */
class DataGrid extends React.Component {
    render() {
        const { className, style, children, data } = this.props;

        const columns = children.props.children.map(n => {
            return {
                field: n.props.field,
                children: n.props.children,
            };
        });

        const header = <thead>
            <tr>
                {columns.map(n => {
                    return <td name={n.field} key={n.field}>{n.children}</td>;
                })}
            </tr>
        </thead>;

        return <table className={classNames('DataGrid', className)} style={style}>
            {header}
        </table>;
    }
}

DataGrid.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: (props, propName, componentName) => {
        const children = props[propName];
        if (children.type !== Columns) {
            return new TypeError(`Invalid prop \`${propName}\` of type \`${children.type.name}\` supplied to \`${componentName}\`, expected \`Columns\`.`);
        }
    },
    data: PropTypes.array,
};

DataGrid.defaultProps = {
    className: null,
    style: null,
    children: null,
    data: [],
};

export default DataGrid;