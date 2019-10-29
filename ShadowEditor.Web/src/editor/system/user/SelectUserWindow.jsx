import './css/SelectUserWindow.css';
import { PropTypes, Window, Content, Buttons, Button, Column, Toolbar, DataGrid, SearchField } from '../../../third_party';

/**
 * 选择用户窗口
 * @author tengge / https://github.com/tengge1
 */
class SelectUserWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageSize: 10,
            pageNum: 1,
            total: 0,
            data: [],
            selected: null,
            keyword: '',
            mask: false
        };

        this.handleSearch = this.handleSearch.bind(this);

        this.renderStatus = this.renderStatus.bind(this);

        this.handleSelect = this.handleSelect.bind(this);
        this.handleChangePageSize = this.handleChangePageSize.bind(this);
        this.handleFirstPage = this.handleFirstPage.bind(this);
        this.handlePreviousPage = this.handlePreviousPage.bind(this);
        this.handleNextPage = this.handleNextPage.bind(this);
        this.handleLastPage = this.handleLastPage.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);

        this.handleOK = this.handleOK.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { pageSize, pageNum, total, data, selected, keyword, mask } = this.state;

        return <Window
            className={'SelectUserWindow'}
            title={_t('Select User')}
            style={{ width: '800px', height: '400px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Toolbar>
                    <SearchField placeholder={_t('Search Content')}
                        value={keyword}
                        onInput={this.handleSearch}
                    />
                </Toolbar>
                <DataGrid data={data}
                    pages
                    pageSize={pageSize}
                    pageNum={pageNum}
                    total={total}
                    selected={selected}
                    mask={mask}
                    onSelect={this.handleSelect}
                    onChangePageSize={this.handleChangePageSize}
                    onFirstPage={this.handleFirstPage}
                    onPreviousPage={this.handlePreviousPage}
                    onNextPage={this.handleNextPage}
                    onLastPage={this.handleLastPage}
                    onRefresh={this.handleRefresh}
                    keyField={'ID'}
                >
                    <Column type={'number'}
                        title={'#'}
                    />
                    <Column field={'Username'}
                        title={_t('Username')}
                        width={120}
                    />
                    <Column field={'Name'}
                        title={_t('NickName')}
                        align={'center'}
                        renderer={this.renderName}
                    />
                    <Column field={'RoleName'}
                        title={_t('Role')}
                        width={120}
                        align={'center'}
                        renderer={this.renderRoleName}
                    />
                    <Column field={'CreateTime'}
                        title={_t('Create Date')}
                        width={120}
                        align={'center'}
                        renderer={this.renderDate}
                    />
                    <Column field={'UpdateTime'}
                        title={_t('Update Date')}
                        width={120}
                        align={'center'}
                        renderer={this.renderDate}
                    />
                    <Column field={'Status'}
                        title={_t('Status')}
                        width={80}
                        align={'center'}
                        renderer={this.renderStatus}
                    />
                </DataGrid>
            </Content>
            <Buttons>
                <Button onClick={this.handleOK}>{_t('OK')}</Button>
                <Button onClick={this.handleClose}>{_t('Cancel')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        this.handleRefresh();
    }

    update(pageSize, pageNum, keyword = '') {
        this.setState({
            mask: true
        });
        fetch(`${app.options.server}/api/User/List?pageSize=${pageSize}&pageNum=${pageNum}&keyword=${keyword}`).then(response => {
            response.json().then(json => {
                app.unmask();
                this.setState({
                    pageSize,
                    pageNum,
                    total: json.Data.total,
                    data: json.Data.rows,
                    keyword: keyword,
                    mask: false
                });
            });
        });
    }

    handleSearch(value) {
        const { pageSize, pageNum } = this.state;
        this.update(pageSize, pageNum, value);
    }

    renderName(value) {
        if(value === 'Administrator') {
            return _t(value);
        }
        return value;
    }

    renderRoleName(value) {
        if (value === 'Administrator' ||
            value === 'User' ||
            value === 'Guest') {
            return _t(value);
        }
        return value;
    }

    renderDate(value) {
        return value.split(' ')[0];
    }

    renderStatus(value) {
        return value === 0 ? _t('Enabled') : _t('Disabled');
    }

    handleSelect(selected) {
        this.setState({
            selected: selected.ID
        });
    }

    handleChangePageSize(value) {
        const { pageNum, keyword } = this.state;
        this.update(value, pageNum, keyword);
    }

    handleFirstPage() {
        const { pageSize, keyword } = this.state;

        this.update(pageSize, 1, keyword);
    }

    handlePreviousPage() {
        const { pageSize, pageNum, keyword } = this.state;
        const newPageNum = pageNum > 1 ? pageNum - 1 : pageNum;

        this.update(pageSize, newPageNum, keyword);
    }

    handleNextPage() {
        const { pageSize, pageNum, total, keyword } = this.state;
        const totalPage = total % pageSize === 0 ? total / pageSize : parseInt(total / pageSize) + 1;
        const newPageNum = pageNum < totalPage ? pageNum + 1 : pageNum;

        this.update(pageSize, newPageNum, keyword);
    }

    handleLastPage() {
        const { pageSize, total, keyword } = this.state;
        const totalPage = total % pageSize === 0 ? total / pageSize : parseInt(total / pageSize) + 1;
        const newPageNum = totalPage;

        this.update(pageSize, newPageNum, keyword);
    }

    handleRefresh() {
        const { pageSize, pageNum, keyword } = this.state;
        this.update(pageSize, pageNum, keyword);
    }

    handleOK() {
        debugger;
    }

    handleClose() {
        app.removeElement(this);
    }
}

SelectUserWindow.propTypes = {
    callback: PropTypes.func
};

SelectUserWindow.defaultProps = {
    callback: null
};

export default SelectUserWindow;