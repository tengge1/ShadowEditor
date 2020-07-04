/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/EditorToolbar.css';
import { Toolbar, ToolbarSeparator, Select } from '../../ui/index';
import GeneralTools from './GeneralTools.jsx';
import EditTools from './EditTools.jsx';
import DrawTools from './DrawTools.jsx';
import MarkTools from './MarkTools.jsx';
import MeasureTools from './MeasureTools.jsx';

/**
 * 编辑器工具栏
 * @author tengge / https://github.com/tengge1
 */
class EditorToolbar extends React.Component {
    constructor(props) {
        super(props);

        this.toolbars = {
            general: _t('General Tools'),
            draw: _t('Draw Tools'),
            edit: _t('Edit Tools'),
            // terrain: _t('Terrain Tools'),
            mark: _t('Mark Tools'),
            measure: _t('Measure Tools')
        };

        this.state = {
            toolbar: 'general'
        };

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { toolbar } = this.state;

        return <Toolbar className={'EditorToolbar'}
            direction={'horizontal'}
               >
            <Select options={this.toolbars}
                name={'toolbar'}
                value={toolbar}
                onChange={this.handleChange}
            />
            <ToolbarSeparator />
            {toolbar === 'general' && <GeneralTools />}
            {toolbar === 'edit' && <EditTools />}
            {toolbar === 'draw' && <DrawTools />}
            {toolbar === 'mark' && <MarkTools />}
            {toolbar === 'measure' && <MeasureTools />}
        </Toolbar>;
    }

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }
}

export default EditorToolbar;