import './css/HistoryPanel.css';
import { classNames, PropTypes, Label } from '../../third_party';

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
    }

    render() {
        const { undos, redos } = this.state;

        return <div className={'HistoryPanel'}>
            <Label>{L_HISTORY}</Label>
            <div className={'content'} onClick={this.handleClick}>
                {undos.map(n => {
                    return <div className={'undo'} value={n.id} key={n.id}>{n.text}</div>;
                })}
                {redos.map(n => {
                    return <div className={'redo'} value={n.id} key={n.id}>{n.text}</div>;
                })}
            </div>
        </div>;
    }

    componentDidMount() {
        app.on(`editorCleared.${this.id}`, this.refreshUI.bind(this));
        app.on(`historyChanged.${this.id}`, this.refreshUI.bind(this));
    }

    update() {
        var history = app.editor.history;

        let undos = [], redos = [];

        history.undos.forEach(n => {
            undos.push({
                value: n.id,
                text: n.name,
            });
        });

        history.redos.forEach(n => {
            redos.push({
                value: n.id,
                text: n.name,
            });
        });

        this.setState({ undos, redos });

        for (var i = 0, l = history.undos.length; i < l; i++) {
            var undo = history.undos[i];
            var option = document.createElement('div');
            option.value = undo.id;
            option.innerHTML = `&nbsp;${undo.name}`;
            option.style.padding = '4px';
            panel.dom.appendChild(option);
        }

        // 重做
        for (var i = history.redos.length - 1; i >= 0; i--) {
            var redo = history.redos[i];
            var option = document.createElement('div');
            option.value = redo.id;
            option.innerHTML = `&nbsp;${redo.name}`;
            option.style.opacity = 0.3;
            option.style.padding = '4px';
            panel.dom.appendChild(option);
        }
    }

    handleClick(event) {
        const value = event.target.value;

        if (!value) {
            return;
        }

        app.editor.history.goToState(value);
    }
}

export default HistoryPanel;