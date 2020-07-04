/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/ScriptEditorPanel.css';
import { classNames } from '../../third_party';
import { Icon } from '../../ui/index';
import ScriptEditor from '../script/ScriptEditor';

/**
 * 脚本面板
 * @author tengge / https://github.com/tengge1
 */
class ScriptEditorPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            uuid: null,
            name: '',
            type: 'javascript',
            source: ''
        };

        this.callback = null;

        this.ref = React.createRef();

        this.handleEditScript = this.handleEditScript.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    render() {
        const { show, name, type } = this.state;

        let title = name;

        switch (type) {
            case 'javascript':
                title = name + '.js';
                break;
            case 'vertexShader':
            case 'fragmentShader':
                title = name + '.glsl';
                break;
            case 'json':
                title = name + '.json';
                break;
        }

        return <div className={classNames('ScriptEditorPanel', !show && 'hidden')}>
            <div className={'header'}>
                <div className={'title'}>{title}</div>
                <Icon icon={'close'}
                    onClick={this.handleSave}
                />
            </div>
            <div className={'content'}
                ref={this.ref}
            />
        </div>;
    }

    componentDidMount() {
        app.require(['codemirror', 'codemirror-addon', 'esprima', 'jsonlint', 'glslprep', 'acorn', 'ternjs']).then(() => {
            app.scriptEditor = new ScriptEditor(this.ref.current);
        });
        app.on(`editScript.ScriptPanel`, this.handleEditScript);
    }

    handleEditScript(uuid, name, type, source, callback) {
        this.callback = callback;

        this.setState({
            show: true,
            uuid,
            name,
            type,
            source
        }, () => {
            app.scriptEditor.setValue(source, type);
        });
    }

    handleSave() {
        const { uuid, name, type } = this.state;

        const source = app.scriptEditor.getValue();

        this.callback && this.callback(uuid, name, type, source);

        this.callback = null;

        this.setState({
            show: false,
            uuid: null,
            name: '',
            type: 'javascript',
            source: ''
        });
    }
}

export default ScriptEditorPanel;