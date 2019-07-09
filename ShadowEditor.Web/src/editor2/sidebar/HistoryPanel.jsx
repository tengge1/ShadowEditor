import './css/HistoryPanel.css';
import { classNames, PropTypes, Button } from '../../third_party';

/**
 * 历史面板
 * @author tengge / https://github.com/tengge1
 */
class HistoryPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            undos: [],
            redos: [],
        };

        this.update = this.update.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClear = this.handleClear.bind(this);
    }

    render() {
        const { undos, redos } = this.state;

        return <div className={'HistoryPanel'}>
            <div className={'toolbar'}>
                <Button onClick={this.handleClear}>{'清空'}</Button>
            </div>
            <div className={'content'} onClick={this.handleClick}>
                {undos.map(n => {
                    return <div className={'undo'} value={n.id} key={n.id}>{n.name}</div>;
                })}
                {redos.map(n => {
                    return <div className={'redo'} value={n.id} key={n.id}>{n.name}</div>;
                })}
            </div>
        </div>;
    }

    componentDidMount() {
        app.on(`editorCleared.${this.id}`, this.update);
        app.on(`historyChanged.${this.id}`, this.update);
    }

    update() {
        var history = app.editor.history;

        let undos = [], redos = [];

        history.undos.forEach(n => {
            undos.push({
                id: n.id,
                name: n.name,
            });
        });

        history.redos.forEach(n => {
            redos.push({
                id: n.id,
                name: n.name,
            });
        });

        this.setState({ undos, redos });
    }

    handleClick(event) {
        const id = event.target.value;

        if (!id) {
            return;
        }

        app.editor.history.goToState(id);
    }

    handleClear() {
        var editor = app.editor;

        app.confirm({
            title: L_CONFIRM,
            content: L_HISTORY_WILL_CLEAR,
            onOK: () => {
                editor.history.clear();
            }
        });
    }
}

export default HistoryPanel;