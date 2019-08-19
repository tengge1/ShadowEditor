import './css/CategoryWindow.css';
import { classNames, PropTypes, Window, Content, Buttons, Form, FormControl, Label, Input, Select, ImageUploader, Button, DataGrid, Columns, Column } from '../../../third_party';
import Ajax from '../../../utils/Ajax';

/**
 * 类别窗口
 * @author tengge / https://github.com/tengge1
 */
class CategoryWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };

        this.updateUI = this.updateUI.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { type, typeName } = this.props;
        const { data } = this.state;

        return <Window
            className={'CategoryWindow'}
            title={`${typeName} ${_t('Category Edit')}`}
            style={{ width: '320px', height: '300px', }}
            mask={true}
            onClose={this.handleClose}>
            <Content>
                <DataGrid data={data} onSelect={this.handleSelect}>
                    <Columns>
                        <Column field={'ID'} title={'ID'}></Column>
                        <Column field={'Name'} title={'名称'}></Column>
                    </Columns>
                </DataGrid>
            </Content>
            <Buttons>
                <Button onClick={this.handleClose}>{_t('Close')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        this.updateUI();
    }

    updateUI() {
        Ajax.getJson(`${app.options.server}/api/Category/List?Type=${this.props.type}`, json => {
            this.setState({
                data: json.Data,
            });
        });
    }

    handleSelect(obj) {
        debugger
    }

    handleClose() {
        app.removeElement(this);
    }
}

CategoryWindow.propTypes = {
    type: PropTypes.oneOf(['Scene', 'Mesh', 'Map', 'Texture', 'Material', 'Audio', 'Particle']),
    typeName: PropTypes.string,
    callback: PropTypes.func,
};

CategoryWindow.defaultProps = {
    type: 'Scene',
    typeName: 'Scene',
    callback: null,
};

export default CategoryWindow;