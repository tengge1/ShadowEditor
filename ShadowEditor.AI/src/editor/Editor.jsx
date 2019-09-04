import './css/Editor.css';

import { BorderLayout, LoadMask } from '../third_party';

import EditorMenuBar from './menu/EditorMenuBar.jsx';
import EditorStatusBar from './status/EditorStatusBar.jsx';
import EditorSideBar from './sidebar/EditorSideBar.jsx';
import AssetsPanel from './assets/AssetsPanel.jsx';

/**
 * 编辑器
 * @author tengge / https://github.com/tengge1
 */
class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showMask: false,
            maskText: _t('Waiting...'),
            elements: [],
        };

        this.type = 'scene'; // 编辑器类型：scene, mesh, texture, material, terrain, ai

        this.onToggle = this.onToggle.bind(this);
    }

    render() {
        const { showMask, maskText, elements } = this.state;

        return <>
            <BorderLayout className={'Editor'}>
                <EditorMenuBar region={'north'}></EditorMenuBar>
                <EditorStatusBar region={'south'}></EditorStatusBar>
                <AssetsPanel region={'west'} split={true} onToggle={this.onToggle}></AssetsPanel>
                <EditorSideBar region={'east'} split={true} onToggle={this.onToggle}></EditorSideBar>
                <BorderLayout region={'center'}>
                </BorderLayout>
            </BorderLayout>
            {elements.map((n, i) => {
                return <div key={i}>{n}</div>;
            })}
            <LoadMask text={maskText} show={showMask}></LoadMask>
        </>;
    }

    // ---------------------- 用户界面 --------------------------------

    createElement(type, props = {}, children = undefined) {
        let ref = React.createRef();
        props.ref = ref;
        return React.createElement(type, props, children);
    }

    addElement(element, callback) {
        let elements = this.state.elements;

        elements.push(element);

        this.setState({ elements }, callback);
    }

    removeElement(element, callback) {
        let elements = this.state.elements;

        let index = elements.findIndex(n => n === element || n.ref && n.ref.current === element)

        if (index > -1) {
            elements.splice(index, 1);
        }

        this.setState({ elements }, callback);
    }

    onToggle(expanded) {
        app.call('resize', this);
    }

    onShowMask(enabled, text) {
        this.setState({
            showMask: enabled,
            maskText: text || _t('Waiting...'),
        });
    }
}

export default Editor;