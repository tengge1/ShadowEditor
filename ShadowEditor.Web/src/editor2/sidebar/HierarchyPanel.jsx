import './css/HierarchyPanel.css';
import { classNames, PropTypes, Tree } from '../../third_party';
import MoveObjectCommand from '../../command/MoveObjectCommand';

/**
 * 场景树状图
 * @author tengge / https://github.com/tengge1
 */
class HierarchyPanel extends React.Component {
    constructor(props) {
        super(props);

        this.expanded = {};
        this.checked = {};

        this.state = {
            data: [],
            selected: null,
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    render() {
        const { data, selected, checked } = this.state;

        return <Tree
            data={data}
            selected={selected}
            checked={checked}
            onSelect={this.handleSelect}
            onCheck={this.handleCheck}
            onDoubleClick={this.handleDoubleClick}
            onExpand={this.handleExpand}
            onDrop={this.handleDrop}></Tree>;
    }

    componentDidMount() {
        app.on(`sceneGraphChanged.${this.id}`, this.updateUI.bind(this));

        // bug: https://gitee.com/tengge1/ShadowEditor/issues/ITCA9
        app.on(`objectChanged.${this.id}`, this.updateUI.bind(this));

        app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    }

    /**
     * 单击树节点
     * @param {*} value 
     */
    handleSelect(value) {
        this.setState({
            selected: value,
        });
        app.editor.selectByUuid(value);
    }

    handleCheck(value, name, event) {
        let checked = this.checked;

        if (value && !checked[name]) {
            checked[name] = true;
        } else if (!value && checked[name]) {
            delete checked[name];
        } else {
            console.warn(`HierarchyPanel: handleCheck error.`);
        }

        this.updateUI();
    }

    handleDoubleClick(value) {
        this.setState({
            selected: value,
        });
        app.editor.focusByUUID(value);
    }

    /**
     * 选中物体改变
     * @param {*} object 
     */
    onObjectSelected(object) {
        this.setState({
            selected: object ? object.uuid : null,
        });
    }

    /**
     * 根据场景变化，更新场景树状图
     */
    updateUI() {
        const scene = app.editor.scene;
        const camera = app.editor.camera;

        let list = [{
            value: camera.uuid,
            text: camera.name,
            cls: 'Camera',
            expanded: false,
            checked: this.checked[camera.uuid] || false,
            draggable: false,
            children: [],
        }];

        this._parseData(scene, list);

        this.setState({ data: list });
    }

    _parseData(obj, list) {
        const scene = app.editor.scene;
        const camera = app.editor.camera;

        let cls = null;

        if (obj === scene) {
            cls = 'Scene';
        } else if (obj instanceof THREE.Line) {
            cls = 'Line';
        } else if (obj instanceof THREE.Light) {
            cls = 'Light';
        } else if (obj instanceof THREE.Points) {
            cls = 'Points';
        } else {
            cls = 'Default';
        }

        let expanded = this.expanded;

        if (obj === scene && expanded[obj.uuid] === undefined) {
            expanded[obj.uuid] = true;
        }

        var data = {
            value: obj.uuid,
            text: obj.name,
            expanded: expanded[obj.uuid],
            checked: this.checked[obj.uuid] || false,
            draggable: obj !== scene && obj !== camera,
            cls: cls,
            children: [],
        };

        list.push(data);

        if (Array.isArray(obj.children)) {
            obj.children.forEach(n => {
                this._parseData(n, data.children);
            });
        }
    }

    /**
     * 展开关闭节点
     * @param {*} value 
     */
    handleExpand(value) {
        let expanded = this.expanded;

        if (expanded[value]) {
            expanded[value] = false;
        } else {
            expanded[value] = true;
        }

        this.updateUI();
    }

    /**
     * 拖动节点
     */
    handleDrop(value, newParentValue, newBeforeValue) {
        var editor = app.editor;

        let object = editor.objectByUuid(value);
        let newParent = editor.objectByUuid(newParentValue);
        let newBefore = null;

        if (newBeforeValue) {
            newBefore = editor.objectByUuid(newBeforeValue);
        }

        app.editor.execute(new MoveObjectCommand(object, newParent, newBefore));

        this.expanded[newParentValue] = true;

        this.updateUI();
    }
}

export default HierarchyPanel;