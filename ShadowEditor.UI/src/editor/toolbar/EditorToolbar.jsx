import './css/EditorToolbar.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Toolbar from '../../toolbar/Toolbar.jsx';
import ToolbarSeparator from '../../toolbar/ToolbarSeparator.jsx';
import IconButton from '../../form/IconButton.jsx';

/**
 * 编辑器工具栏
 * @author tengge / https://github.com/tengge1
 */
class EditorToolbar extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        alert('Translate');
    }

    render() {
        return <Toolbar className={'EditorToolbar'} direction={'vertical'}>
            <IconButton icon={'select'} selected={true} onClick={this.handleClick}></IconButton>
            <IconButton icon={'translate'}></IconButton>
            <IconButton icon={'rotate'}></IconButton>
            <IconButton icon={'scale'}></IconButton>
            <ToolbarSeparator />
            <IconButton icon={'point'}></IconButton>
            <IconButton icon={'line'}></IconButton>
            <IconButton icon={'spray'}></IconButton>
            <IconButton icon={'texture'}></IconButton>
        </Toolbar>;
    }
}

export default EditorToolbar;