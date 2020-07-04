/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/DataGrid.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Column from '../common/Column.jsx';
import IconButton from '../form/IconButton.jsx';
import Input from '../form/Input.jsx';
import Label from '../form/Label.jsx';
import Select from '../form/Select.jsx';
import CheckBox from '../form/CheckBox.jsx';
import ToolbarSeparator from '../toolbar/ToolbarSeparator.jsx';
import ToolbarFiller from '../toolbar/ToolbarFiller.jsx';
import LoadMask from '../progress/LoadMask.jsx';

/**
 * 数据表格
 * @author tengge / https://github.com/tengge1
 */
class DataGrid extends React.Component {
    constructor(props) {
        super(props);

        this.pageSize = {
            10: '10',
            20: '20',
            50: '50',
            100: '100'
        };

        this.handleClick = this.handleClick.bind(this, props.onSelect);
        this.handleSelectAll = this.handleSelectAll.bind(this);

        this.handleChangePageSize = this.handleChangePageSize.bind(this, props.onChangePageSize);
        this.handleFirstPage = this.handleFirstPage.bind(this, props.onFirstPage);
        this.handlePreviousPage = this.handlePreviousPage.bind(this, props.onPreviousPage);
        this.handleNextPage = this.handleNextPage.bind(this, props.onNextPage);
        this.handleLastPage = this.handleLastPage.bind(this, props.onLastPage);
        this.handleRefresh = this.handleRefresh.bind(this, props.onRefresh);
    }

    render() {
        const { className, style, children, pages, data, keyField, pageSize, pageNum, total, selected, mask } = this.props;

        const totalPage = total % pageSize === 0 ? total / pageSize : parseInt(total / pageSize) + 1;

        // 计算列宽：
        // 数字列(type: number)、复选框列(type: checkbox)：60px。
        // 其他列：提供的按提供的数值(px)。

        // 表格列
        const columns = React.Children.map(children, n => {
            return n.props;
        });

        // 表格头
        const head = <table className={'head'}>
            <thead>
                <tr>
                    {columns.map(col => {
                        if (col.type === 'number') {
                            return <th className={'number'}
                                width={60}
                                name={'number'}
                                key={'number'}
                                   >{'#'}</th>;
                        } else if (col.type === 'checkbox') {
                            const selectAll = data.length > 0 && data.every(n => n[col.field] === true);
                            return <th className={'checkbox'}
                                width={60}
                                name={'checkbox'}
                                key={'checkbox'}
                                   >
                                <CheckBox name={col.field}
                                    checked={selectAll}
                                    onChange={this.handleSelectAll}
                                />
                            </th>;
                        } else {
                            return <th width={col.width}
                                name={col.field}
                                key={col.field}
                                   >{col.title}</th>;
                        }
                    })}
                </tr>
            </thead>
        </table>;

        // 表格体
        const body = <table className={'body'}>
            <tbody>
                {data.map((row, i) => {
                    return <tr className={selected === row[keyField] ? 'selected' : null}
                        data-id={row[keyField]}
                        key={row[keyField]}
                        onClick={this.handleClick}
                           >
                        {columns.map(col => {
                            if (col.type === 'number') {
                                const value = pageSize * (pageNum - 1) + i + 1;
                                return <td className={'number'}
                                    width={60}
                                    align={'center'}
                                    key={'number'}
                                       >{value}</td>;
                            } else if (col.type === 'checkbox') {
                                const value = row[col.field] === true;
                                return <td className={col.type}
                                    width={60}
                                    align={'center'}
                                    key={'number'}
                                       >
                                    <CheckBox checked={value} />
                                </td>;
                            } else {
                                const value = col.renderer ? col.renderer(row[col.field], row) : row[col.field];
                                if (col.danger) {
                                    return <td width={col.width}
                                        align={col.align}
                                        key={col.field}
                                        dangerouslySetInnerHTML={{__html: value}}
                                           />;
                                } else {
                                    return <td width={col.width}
                                        align={col.align}
                                        key={col.field}
                                           >{value}</td>;
                                }
                            }
                        })}
                    </tr>;
                })}
            </tbody>
        </table>;

        return <div className={classNames('DataGrid', pages && 'pages', className)}
            style={style}
               >
            {head}
            <div className={'wrap'}>
                {body}
            </div>
            {pages && <div className={'page'}>
                <Select className={'pageSize'}
                    name={'pageSize'}
                    options={this.pageSize}
                    value={pageSize.toString()}
                    onChange={this.handleChangePageSize}
                />
                <ToolbarSeparator className={'line'} />
                <IconButton icon={'backward'}
                    title={_t('First Page')}
                    onClick={this.handleFirstPage}
                />
                <IconButton icon={'left-triangle2'}
                    title={_t('Previous Page')}
                    onClick={this.handlePreviousPage}
                />
                <Input className={'current'}
                    value={pageNum}
                    title={_t('Current Page')}
                />
                <span className={'slash'}> / </span>
                <Label className={'totalPage'}>{totalPage}</Label>
                <IconButton icon={'right-triangle2'}
                    title={_t('Next Page')}
                    onClick={this.handleNextPage}
                />
                <IconButton icon={'forward'}
                    title={_t('Last Page')}
                    onClick={this.handleLastPage}
                />
                <ToolbarSeparator className={'line'} />
                <IconButton icon={'refresh'}
                    title={_t('Refresh')}
                    onClick={this.handleRefresh}
                />
                <ToolbarFiller />
                <div className={'info'}>
                    {_t('{{pageSize}} per page, total {{total}} records.', { pageSize, total })}
                </div>
            </div>}
            <LoadMask text={_t('Loading...')}
                show={mask}
            />
        </div>;
    }

    handleClick(onSelect, event) {
        const keyField = this.props.keyField;
        const id = event.currentTarget.getAttribute('data-id');

        const record = this.props.data.filter(n => n[keyField] === id)[0];

        onSelect && onSelect(record);
    }

    handleSelectAll(value, name, event) {
        const { onSelectAll } = this.props;
        onSelectAll && onSelectAll(value, name, event);
    }

    handleChangePageSize(onChangePageSize, value, event) {
        const pageSize = parseInt(value);
        onChangePageSize && onChangePageSize(pageSize, event);
    }

    handleFirstPage(onFirstPage, event) {
        onFirstPage && onFirstPage(event);
    }

    handlePreviousPage(onPreviousPage, event) {
        onPreviousPage && onPreviousPage(event);
    }

    handleNextPage(onNextPage, event) {
        onNextPage && onNextPage(event);
    }

    handleLastPage(onLastPage, event) {
        onLastPage && onLastPage(event);
    }

    handleRefresh(onRefresh, event) {
        onRefresh && onRefresh(event);
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
    mask: PropTypes.bool,
    onSelect: PropTypes.func,
    onSelectAll: PropTypes.func,
    onChangePageSize: PropTypes.func,
    onFirstPage: PropTypes.func,
    onPreviousPage: PropTypes.func,
    onNextPage: PropTypes.func,
    onLastPage: PropTypes.func,
    onRefresh: PropTypes.func
};

DataGrid.defaultProps = {
    className: null,
    style: null,
    children: [],
    pages: false,
    data: [],
    keyField: 'id',
    pageSize: 20,
    pageNum: 1,
    total: 0,
    selected: null,
    mask: false,
    onSelect: null,
    onSelectAll: null,
    onChangePageSize: null,
    onFirstPage: null,
    onPreviousPage: null,
    onNextPage: null,
    onLastPage: null,
    onRefresh: null
};

export default DataGrid;