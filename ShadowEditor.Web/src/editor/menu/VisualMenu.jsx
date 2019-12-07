import { MenuItem, MenuItemSeparator } from '../../third_party';
import Button from '../../visual/component/Button';

/**
 * 数据可视化菜单
 * @author tengge / https://github.com/tengge1
 */
class VisualMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddButton = this.handleAddButton.bind(this);
    }

    render() {
        return <MenuItem title={_t('Visual')}>
            <MenuItem title={_t('Basic Shape')}
                onClick={this.handleAddCircle}
            />
        </MenuItem>;
    }

    handleAddButton() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new Button());
        visual.render(svg);
    }
}

export default VisualMenu;