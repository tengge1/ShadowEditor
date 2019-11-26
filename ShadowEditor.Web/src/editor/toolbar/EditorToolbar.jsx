import './css/EditorToolbar.css';
import { Toolbar, ToolbarSeparator, Select } from '../../third_party';
import GeneralTools from './GeneralTools.jsx';
import DrawTools from './DrawTools.jsx';
import MarkTools from './MarkTools.jsx';

/**
 * 编辑器工具栏
 * @author tengge / https://github.com/tengge1
 */
class EditorToolbar extends React.Component {
    constructor(props) {
        super(props);

        this.toolbars = {
            general: _t('General Tools'),
            draw: _t('Draw Tools'),
            edit: _t('Edit Tools'),
            terrain: _t('Terrain Tools'),
            mark: _t('Mark Tools'),
            measure: _t('Measure Tools')
        };

        this.state = {
            toolbar: 'general'
        };

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { toolbar } = this.state;

        return <Toolbar className={'EditorToolbar'}
            direction={'horizontal'}
        >
            <Select options={this.toolbars}
                name={'toolbar'}
                value={toolbar}
                onChange={this.handleChange}
            />
            <ToolbarSeparator />
            {toolbar === 'general' && <GeneralTools />}
            {toolbar === 'draw' && <DrawTools />}
            {toolbar === 'mark' && <MarkTools />}
        </Toolbar>;
    }

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }
}

export default EditorToolbar;