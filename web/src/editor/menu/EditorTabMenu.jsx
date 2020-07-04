/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { MenuTab } from '../../ui/index';

/**
 * 编辑器选项卡菜单
 * @author tengge / https://github.com/tengge1
 */
class EditorTabMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: 'scene'
        };

        this.handleSelect = this.handleSelect.bind(this);
    }

    render() {
        const { type } = this.state;

        return <>
            <MenuTab name={'scene'}
                selected={type === 'scene'}
                onClick={this.handleSelect}
            >{_t('Scene Editor')}</MenuTab>
            <MenuTab name={'mesh'}
                selected={type === 'mesh'}
                onClick={this.handleSelect}
            >{_t('Mesh Editor')}</MenuTab>
            <MenuTab name={'texture'}
                selected={type === 'texture'}
                onClick={this.handleSelect}
            >{_t('Texture Editor')}</MenuTab>
            <MenuTab name={'material'}
                selected={type === 'material'}
                onClick={this.handleSelect}
            >{_t('Material Editor')}</MenuTab>
            <MenuTab name={'terrain'}
                selected={type === 'terrain'}
                onClick={this.handleSelect}
            >{_t('Terrain Editor')}</MenuTab>
            <MenuTab name={'ai'}
                selected={type === 'ai'}
                onClick={this.handleSelect}
            >{_t('AI Editor')}</MenuTab>
        </>;
    }

    handleSelect(name) {
        app.editor.type = name;

        this.setState({
            type: name
        });
    }
}

export default EditorTabMenu;