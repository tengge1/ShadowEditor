/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/HelpMenu.css';
import { MenuItem, MenuItemSeparator } from '../../ui/index';
import RendererAttributesWindow from './window/RendererAttributesWindow.jsx';
import ThreeJsInformationWindow from './window/ThreeJsInformationWindow.jsx';
import ExtensionWindow from './window/ExtensionWindow.jsx';

/**
 * 帮助菜单
 * @author tengge / https://github.com/tengge1
 */
class HelpMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleRendererAttributes = this.handleRendererAttributes.bind(this);
        this.handleThreeJsInformation = this.handleThreeJsInformation.bind(this);
        this.handleExtension = this.handleExtension.bind(this);
        this.handleVisitSketchfab = this.handleVisitSketchfab.bind(this);
        this.handleVisit3dpunk = this.handleVisit3dpunk.bind(this);
        this.handleGitHubSource = this.handleGitHubSource.bind(this);
        this.handleGiteeSource = this.handleGiteeSource.bind(this);
        this.handleDocument = this.handleDocument.bind(this);
        this.handleGitHubExamples = this.handleGitHubExamples.bind(this);
        this.handleGiteeExamples = this.handleGiteeExamples.bind(this);
        this.handleAbout = this.handleAbout.bind(this);
    }

    render() {
        return <MenuItem title={_t('Help')}>
            <MenuItem title={_t('Renderer Attributes')}
                onClick={this.handleRendererAttributes}
            />
            <MenuItem title={_t('Three.js Information')}
                onClick={this.handleThreeJsInformation}
            />
            <MenuItem title={_t('WebGL Extensions')}
                onClick={this.handleExtension}
            />
            <MenuItemSeparator />
            <MenuItem title={_t('Download Mesh')}>
                <MenuItem title={_t('Sketchfab')}
                    onClick={this.handleVisitSketchfab}
                />
                <MenuItem title={_t('3dpunk')}
                    onClick={this.handleVisit3dpunk}
                />
            </MenuItem>
            <MenuItemSeparator />
            <MenuItem title={_t('Source')}>
                <MenuItem title={_t('GitHub')}
                    onClick={this.handleGitHubSource}
                />
                <MenuItem title={_t('Gitee')}
                    onClick={this.handleGiteeSource}
                />
            </MenuItem>
            <MenuItem title={_t('Documents')}
                onClick={this.handleDocument}
            />
            <MenuItem title={_t('Examples')}>
                <MenuItem title={_t('GitHub')}
                    onClick={this.handleGitHubExamples}
                />
                <MenuItem title={_t('Gitee')}
                    onClick={this.handleGiteeExamples}
                />
            </MenuItem>
            <MenuItem title={_t('About')}
                onClick={this.handleAbout}
            />
        </MenuItem>;
    }

    handleRendererAttributes() {
        const win = app.createElement(RendererAttributesWindow);
        app.addElement(win);
    }

    handleThreeJsInformation() {
        const win = app.createElement(ThreeJsInformationWindow);
        app.addElement(win);
    }

    handleExtension() {
        const win = app.createElement(ExtensionWindow);
        app.addElement(win);
    }

    handleVisitSketchfab() {
        window.open('https://sketchfab.com/3d-models?features=downloadable', '_blank');
    }

    handleVisit3dpunk() {
        window.open('https://www.3dpunk.com/work/index.html?category=downloadable', '_blank');
    }

    handleGitHubSource() {
        window.open('https://github.com/tengge1/ShadowEditor', '_blank');
    }

    handleGiteeSource() {
        window.open('https://gitee.com/tengge1/ShadowEditor', '_blank');
    }

    handleDocument() {
        window.open('https://gitee.com/tengge1/ShadowEditor/wikis/pages', '_blank');
    }

    handleGitHubExamples() {
        window.open('https://tengge1.github.io/ShadowEditor-examples/', '_blank');
    }

    handleGiteeExamples() {
        window.open('http://tengge1.gitee.io/shadoweditor-examples/', '_blank');
    }

    handleAbout() {
        app.alert({
            title: _t('About'),
            className: 'About',
            content: <>
                {_t('Name')}: ShadowEditor<br />
                {_t('Author')}: tengge1<br />
                {_t('Lisense')}: MIT<br />
                {_t('Source')}1: <a href="https://github.com/tengge1/ShadowEditor"
                    target="_blank"
                    rel="noopener noreferrer"
                                 >https://github.com/tengge1/ShadowEditor</a><br />
                {_t('Source')}2: <a href="https://gitee.com/tengge1/ShadowEditor"
                    target="_blank"
                    rel="noopener noreferrer"
                                 >https://gitee.com/tengge1/ShadowEditor</a><br />
            </>
        });
    }
}

export default HelpMenu;