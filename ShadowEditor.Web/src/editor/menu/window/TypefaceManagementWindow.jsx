import './css/TypefaceManagementWindow.css';
import { Window, Content, Buttons, Button, DataGrid, Column } from '../../../third_party';

/**
 * 字体管理器窗口
 * @author tengge / https://github.com/tengge1
 */
class TypefaceManagementWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            selected: null,
            mask: false
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { data, selected, mask } = this.state;

        return <Window
            className={'TypefaceManagementWindow'}
            title={_t('Typeface Management')}
            style={{ width: '400px', height: '320px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <DataGrid data={data}
                    selected={selected}
                    mask={mask}
                    keyField={'ID'}
                    onSelect={this.handleSelect}
                >
                    <Column type={'number'} />
                    <Column field={'Name'}
                        title={_t('Name')}
                    />
                </DataGrid>
            </Content>
            <Buttons>
                <Button onClick={this.handleClose}>{_t('Close')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        this.update();
    }

    update() {
        this.setState({
            mask: true
        });
        fetch(`${app.options.server}/api/Typeface/List`).then(response => {
            response.json().then(json => {
                this.setState({
                    data: json.Data,
                    mask: false
                });
            });
        });
    }

    handleSelect(record) {
        this.setState({
            selected: record.ID
        });
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default TypefaceManagementWindow;