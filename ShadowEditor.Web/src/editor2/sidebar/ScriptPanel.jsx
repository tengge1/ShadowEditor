import './css/ScriptPanel.css';
import { classNames, PropTypes, Button } from '../../third_party';
import ScriptWindow from './window/ScriptWindow.jsx';

/**
 * 历史面板
 * @author tengge / https://github.com/tengge1
 */
class ScriptPanel extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddScript = this.handleAddScript.bind(this);
        this.handleEditScript = this.handleEditScript.bind(this);
        this.handleRemoveScript = this.handleRemoveScript.bind(this);
        this.update = this.update.bind(this);
    }

    render() {
        return <div className={'ScriptPanel'}>
            <div className={'toolbar'}>
                <Button onClick={this.handleAddScript}>{L_NEW_SCRIPT}</Button>
            </div>
            <div className={'content'}>
            </div>
        </div>;
    }

    componentDidMount() {
        // app.on(`scriptChanged.${this.id}`, this.update);
    }

    update() {
        var container = UI.get('scriptsContainer');
        container.dom.innerHTML = '';
        container.dom.style.display = 'none';

        var scripts = app.editor.scripts;

        if (Object.keys(scripts).length === 0) {
            return;
        }

        container.dom.style.display = 'block';

        Object.keys(scripts).forEach(n => {
            var script = scripts[n];
            var uuid = script.uuid;
            var name = script.name;
            var extension;

            switch (script.type) {
                case 'javascript':
                    extension = '.js';
                    break;
                case 'vertexShader':
                case 'fragmentShader':
                    extension = '.glsl';
                    break;
                case 'json':
                    extension = '.json';
                    break;
            }

            var data = {
                xtype: 'control',
                parent: container.dom,
                children: [{
                    xtype: 'text',
                    text: name + extension,
                    style: {
                        width: '100px',
                        fontSize: '12px'
                    }
                }, {
                    xtype: 'button',
                    text: L_EDIT,
                    style: {
                        marginLeft: '4px'
                    },
                    onClick: () => {
                        this.editScript(uuid);
                    }
                }, {
                    xtype: 'button',
                    text: L_DELETE,
                    style: {
                        marginLeft: '4px'
                    },
                    onClick: () => {
                        this.deleteScript(uuid);
                    }
                }, {
                    xtype: 'br'
                }]
            };

            UI.create(data).render();
        });
    }

    handleAddScript() {
        const window = app.createElement(ScriptWindow);

        app.addElement(window, () => {
            let win1 = window;
            debugger
        });
    }

    handleEditScript(uuid) {
        var script = app.editor.scripts[uuid];
        if (script) {
            app.script.open(uuid, script.name, script.type, script.source, script.name, source => {
                script.source = source;
            });
        }
    }

    handleRemoveScript(uuid) {
        var script = app.editor.scripts[uuid];

        UI.confirm(L_CONFIRM, `${L_DELETE} ${script.name}？`, (event, btn) => {
            if (btn === 'ok') {
                delete app.editor.scripts[uuid];
                app.call('scriptChanged', this);
            }
        });
    }
}

export default ScriptPanel;