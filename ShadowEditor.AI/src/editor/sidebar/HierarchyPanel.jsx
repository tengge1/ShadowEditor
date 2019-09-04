import './css/HierarchyPanel.css';
import { classNames, PropTypes, Tree } from '../../third_party';

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

        this.updateUI = this.updateUI.bind(this);
        this.handleObjectSelected = this.handleObjectSelected.bind(this);

        this.handleSelect = this.handleSelect.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleClickVisible = this.handleClickVisible.bind(this);

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
            onClickIcon={this.handleClickVisible}
            onExpand={this.handleExpand}
            onDrop={this.handleDrop}></Tree>;
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

    }

    handleClickVisible(value, name, event) {

    }

    /**
     * 选中物体改变
     * @param {*} object 
     */
    handleObjectSelected(object) {

    }

    /**
     * 根据场景变化，更新场景树状图
     */
    updateUI() {

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

    }
}

export default HierarchyPanel;