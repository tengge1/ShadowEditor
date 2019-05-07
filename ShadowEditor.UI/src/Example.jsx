// layout
import HBoxLayout from './layout/HBoxLayout.jsx';
import VBoxLayout from './layout/VBoxLayout.jsx';

import Panel from './panel/Panel.jsx';

const Style = {
    container: {
        width: '100%',
        height: '100%',
    },
};

/**
 * 示例
 */
class Example {
    render(container) {
        const component = <VBoxLayout style={Style.container}></VBoxLayout>;

        ReactDOM.render(component, container);
    }
}

export default Example;