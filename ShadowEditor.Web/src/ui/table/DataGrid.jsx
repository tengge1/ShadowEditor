import './css/DataGrid.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Column from '../common/Column.jsx';

/**
 * 数据表格
 * @author tengge / https://github.com/tengge1
 */
class DataGrid extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this, props.onSelect);
    }

    render() {
        const { className, style, children, pages, data, keyField, pageSize, pageNum, total, selected } = this.props;

        // 计算列宽：
        // 数字列：60px。
        // 其他列：提供的按提供的数值(px)。

        // 表格列
        const columns = children.map(n => {
            return n.props;
        });

        // 表格头
        const head = <table className={'head'}>
            <thead>
                <tr>
                    {columns.map(col => {
                        const isNumberColumn = col.type === 'number';
                        const field = isNumberColumn ? 'number' : col.field;
                        const className = isNumberColumn ? 'number' : null;
                        const width = col.type === 'number' ? 60 : col.width;
                        return <th className={className} width={width} name={field} key={field}>{col.title}</th>;
                    })}
                </tr>
            </thead>
        </table>;

        // 表格体
        const body = <table className={'body'}>
            <tbody>
                {data.map((row, i) => {
                    return <tr className={selected === row[keyField] ? 'selected' : null} data-id={row[keyField]} key={row[keyField]} onClick={this.handleClick}>
                        {columns.map(col => {
                            if (col.type === 'number') {
                                const value = col.renderer ? col.renderer(i + 1, row, col) : (i + 1);
                                return <td className={'number'} width={60} align={'center'} key={'number'}>{value}</td>;
                            } else {
                                const value = col.renderer ? col.renderer(row[col.field]) : row[col.field];
                                return <td width={col.width} align={col.align} key={col.field}>{value}</td>;
                            }
                        })}
                    </tr>;
                })}
            </tbody>
        </table>;

        return <div className={classNames('DataGrid', className)} style={style}>
            {head}
            <div className={'wrap'}>
                {body}
            </div>
        </div>;
    }

    handleClick(onSelect, event) {
        const keyField = this.props.keyField;
        const id = event.currentTarget.getAttribute('data-id');

        const record = this.props.data.filter(n => n[keyField] === id)[0];

        onSelect && onSelect(record);
    }
}

DataGrid.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: (props, propName, componentName) => {
        const children = props[propName];

        Array.isArray(children) && children.forEach(n => {
            if (n.type !== Column) {
                return new TypeError(`Invalid prop \`${propName}\` of type \`${n.type.name}\` supplied to \`${componentName}\`, expected \`Column\`.`);
            }
        });
    },
    pages: PropTypes.bool,
    data: PropTypes.array,
    keyField: PropTypes.string,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    total: PropTypes.number,
    selected: PropTypes.string,
    onSelect: PropTypes.func,
};

DataGrid.defaultProps = {
    className: null,
    style: null,
    children: null,
    pages: false,
    data: [],
    keyField: 'id',
    pageSize: 20,
    pageNum: 1,
    total: 0,
    selected: null,
    onSelect: null,
};

export default DataGrid;