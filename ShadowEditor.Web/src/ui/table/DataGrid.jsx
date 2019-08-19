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
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this, props.onSelect);
    }

    handleClick(onSelect, event) {
        const id = event.currentTarget.getAttribute('data-id');
        const record = this.state.data.filter(n => n.id === id)[0];

        onSelect && onSelect(record);
    }

    render() {
        const { className, style, children, data, selected } = this.props;

        const columns = children.props.children.map(n => {
            return {
                type: n.props.type,
                field: n.props.field,
                title: n.props.title,
            };
        });

        const header = <thead>
            <tr>
                {columns.map(n => {
                    let field = n.type === 'number' ? 'number' : n.field;
                    return <td name={n.field} key={field}>{n.title}</td>;
                })}
            </tr>
        </thead>;

        const body = <tbody>
            {data.map(n => {
                return <tr className={selected === n.id ? 'selected' : null} data-id={n.id} key={n.id} onClick={this.handleClick}>
                    {columns.map((m, j) => {
                        if (m.type === 'number') {
                            return <td key={'number'}>{j + 1}</td>;
                        } else {
                            return <td key={m.field}>{n[m.field]}</td>;
                        }
                    })}
                </tr>;
            })}
        </tbody>;

        return <table className={classNames('DataGrid', className)} style={style}>
            {header}
            {body}
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
    selected: PropTypes.string,
    onSelect: PropTypes.func,
};

DataGrid.defaultProps = {
    className: null,
    style: null,
    children: null,
    data: [],
    selected: null,
    onSelect: null,
};

export default DataGrid;