import { PropTypes, MenuItem, MenuItemSeparator, MenuTab } from '../../third_party';

/**
 * 编辑器选项卡菜单
 * @author tengge / https://github.com/tengge1
 */
class EditorTabMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleSelectEditor = this.handleSelectEditor.bind(this);
    }

    render() {
        return <>
            <MenuTab selected={true}>{_t('Scene Editor')}</MenuTab>
            <MenuTab>{_t('Mesh Editor')}</MenuTab>
            <MenuTab>{_t('Texture Editor')}</MenuTab>
            <MenuTab>{_t('Material Editor')}</MenuTab>
            <MenuTab>{_t('Terrain Editor')}</MenuTab>
            <MenuTab>{_t('AI Editor')}</MenuTab>
        </>;
    }

    handleSelectEditor() {

    }
}

export default EditorTabMenu;