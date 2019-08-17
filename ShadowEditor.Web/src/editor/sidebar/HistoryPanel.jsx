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

        this.ref = React.createRef();

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
            <div className={'content'} ref={this.ref} onClick={this.handleClick}>
                {undos.map(n => {
                    return <div className={'undo'} value={n.id} key={n.id} onClick={this.handleClick}>{n.name}</div>;
                })}
                {redos.map(n => {
                    return <div className={'redo'} value={n.id} key={n.id} onClick={this.handleClick}>{n.name}</div>;
                })}
            </div>
        </div>;
    }

    componentDidMount() {
        app.on(`editorCleared.HistoryPanel`, this.update);
        app.on(`historyChanged.HistoryPanel`, this.update);
    }

    componentDidUpdate() {
        let dom = this.ref.current;
        dom.scrollTop = dom.scrollHeight;
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

        undos.sort((a, b) => { return a.id - b.id; });
        redos.sort((a, b) => { return a.id - b.id; });

        this.setState({ undos, redos });
    }

    handleClick(event) {
        const id = event.target.getAttribute('value');

        if (!id) {
            return;
        }

        app.editor.history.goToState(parseInt(id));

        this.update();
    }

    handleClear() {
        var editor = app.editor;

        app.confirm({
            title: _t('Confirm'),
            content: _t('Undo/Redo history will be cleared. Are you sure?'),
            onOK: () => {
                editor.history.clear();
            }
        });
    }
}

export default HistoryPanel;