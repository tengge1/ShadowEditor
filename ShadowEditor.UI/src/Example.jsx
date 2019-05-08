// layout
import HBoxLayout from './layout/HBoxLayout.jsx';
import VBoxLayout from './layout/VBoxLayout.jsx';

// menu
import DropDown from './menu/DropDown.jsx';
import DropDownItem from './menu/DropDownItem.jsx';
import DropDownSeparator from './menu/DropDownSeparator.jsx';
import MenuBar from './menu/MenuBar.jsx';
import MenuItem from './menu/MenuItem.jsx';

import Panel from './panel/Panel.jsx';

const Style = {
    container: {
        width: '100%',
        height: '100%',
    },
    dropDown: {
        display: 'none',
    },
};

/**
 * 示例
 */
class Example {
    render(container) {
        const component =
            <VBoxLayout style={Style.container}>
                <MenuBar>
                    <MenuItem>Scene</MenuItem>
                    <MenuItem>Edit</MenuItem>
                    <MenuItem>2D</MenuItem>
                    <MenuItem>Geometry</MenuItem>
                    <MenuItem>Light</MenuItem>
                    <MenuItem>Assets</MenuItem>
                    <MenuItem>Component</MenuItem>
                    <MenuItem>Play</MenuItem>
                    <MenuItem>Tool</MenuItem>
                    <MenuItem>Options</MenuItem>
                    <MenuItem>Help</MenuItem>
                </MenuBar>
                <DropDown style={Style.dropDown}>
                    <DropDownItem>New</DropDownItem>
                    <DropDownItem>Save</DropDownItem>
                    <DropDownItem>Save As</DropDownItem>
                    <DropDownSeparator></DropDownSeparator>
                    <DropDownItem>Export Scene</DropDownItem>
                </DropDown>
            </VBoxLayout>;

        ReactDOM.render(component, container);
    }
}

export default Example;