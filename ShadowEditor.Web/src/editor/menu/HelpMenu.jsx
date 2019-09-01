import './css/HelpMenu.css';
import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';
import RendererrAttributesWindow from './window/RendererrAttributesWindow.jsx';

/**
 * 帮助菜单
 * @author tengge / https://github.com/tengge1
 */
class HelpMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleRendererAttributes = this.handleRendererAttributes.bind(this);
        this.handleSource = this.handleSource.bind(this);
        this.handleExamples = this.handleExamples.bind(this);
        this.handleDocuments = this.handleDocuments.bind(this);
        this.handleAbout = this.handleAbout.bind(this);
    }

    render() {
        return <MenuItem title={_t('Help')}>
            <MenuItem title={_t('Renderer Attributes')} onClick={this.handleRendererAttributes}></MenuItem>
            <MenuItemSeparator></MenuItemSeparator>
            <MenuItem title={_t('Source')} onClick={this.handleSource}></MenuItem>
            <MenuItem title={_t('Examples')} onClick={this.handleExamples}></MenuItem>
            <MenuItem title={_t('Documents')} onClick={this.handleDocuments}></MenuItem>
            <MenuItem title={_t('About')} onClick={this.handleAbout}></MenuItem>
        </MenuItem>;
    }

    handleRendererAttributes() {
        const win = app.createElement(RendererrAttributesWindow);
        app.addElement(win);
    }

    handleSource() {
        window.open('https://github.com/tengge1/ShadowEditor', '_blank');
    }

    handleExamples() {
        window.open('https://github.com/tengge1/ShadowEditor-examples', '_blank');
    }

    handleDocuments() {
        window.open('https://tengge1.github.io/ShadowEditor/', '_blank');
    }

    handleAbout() {
        app.alert({
            title: _t('About'),
            className: 'About',
            content: <>
                {_t('Name')}: ShadowEditor<br />
                {_t('Author')}: tengge1<br />
                {_t('Lisense')}: MIT<br />
                {_t('Source')}1: <a href="https://github.com/tengge1/ShadowEditor" target="_blank">https://github.com/tengge1/ShadowEditor</a><br />
                {_t('Source')}2: <a href="https://gitee.com/tengge1/ShadowEditor" target="_blank">https://gitee.com/tengge1/ShadowEditor</a><br />
            </>
        });
    }
}

export default HelpMenu;