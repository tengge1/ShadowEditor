import { MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 视图菜单
 * @author tengge / https://github.com/tengge1
 */
class ViewMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            westPanelShow: app.storage.westPanelShow,
            eastPanelShow: app.storage.eastPanelShow,
            toolbarShow: app.storage.toolbarShow,
            timelinePanelShow: app.storage.timelinePanelShow,
            statusBarShow: app.storage.statusBarShow,

            showStats: app.storage.showStats,
            showGrid: app.storage.showGrid,
            showViewHelper: app.storage.showViewHelper,
            enablePhysics: app.options.enablePhysics,
            isThrowBall: false
        };

        this.handleShowWestPanel = this.handleShowWestPanel.bind(this);
        this.handleShowEastPanel = this.handleShowEastPanel.bind(this);
        this.handleShowToolbar = this.handleShowToolbar.bind(this);
        this.handleShowTimelinePanel = this.handleShowTimelinePanel.bind(this);
        this.handleShowStatusBar = this.handleShowStatusBar.bind(this);

        this.handleShowStats = this.handleShowStats.bind(this);
        this.handleShowGrid = this.handleShowGrid.bind(this);
        this.handleShowViewHelper = this.handleShowViewHelper.bind(this);

        this.handleEnablePhysics = this.handleEnablePhysics.bind(this);
        this.handleEnableThrowBall = this.handleEnableThrowBall.bind(this);
    }

    render() {
        const { westPanelShow, eastPanelShow, toolbarShow, timelinePanelShow, statusBarShow, showStats, showGrid, showViewHelper, enablePhysics, isThrowBall } = this.state;

        return <MenuItem title={_t('View')}>
            <MenuItem title={_t('West Panel')}
                checked={westPanelShow}
                onClick={this.handleShowWestPanel}
            />
            <MenuItem title={_t('East Panel')}
                checked={eastPanelShow}
                onClick={this.handleShowEastPanel}
            />
            <MenuItem title={_t('Toolbar')}
                checked={toolbarShow}
                onClick={this.handleShowToolbar}
            />
            <MenuItem title={_t('Timeline Panel')}
                checked={timelinePanelShow}
                onClick={this.handleShowTimelinePanel}
            />
            <MenuItem title={_t('Status Bar')}
                checked={statusBarShow}
                onClick={this.handleShowStatusBar}
            />
            <MenuItemSeparator />
            <MenuItem title={_t('Stats')}
                checked={showStats}
                onClick={this.handleShowStats}
            />
            <MenuItem title={_t('Grid')}
                checked={showGrid}
                onClick={this.handleShowGrid}
            />
            <MenuItem title={_t('View Helper')}
                checked={showViewHelper}
                onClick={this.handleShowViewHelper}
            />
            <MenuItemSeparator />
            <MenuItem title={_t('Physics Engine')}
                checked={enablePhysics}
                onClick={this.handleEnablePhysics}
            />
            <MenuItem title={_t('Throw Ball')}
                checked={isThrowBall}
                onClick={this.handleEnableThrowBall}
            />
        </MenuItem>;
    }

    handleShowWestPanel() {
        const westPanelShow = !app.storage.westPanelShow;
        app.storage.westPanelShow = westPanelShow;

        this.setState({
            westPanelShow
        });
    }

    handleShowEastPanel() {
        const eastPanelShow = !app.storage.eastPanelShow;
        app.storage.eastPanelShow = eastPanelShow;

        this.setState({
            eastPanelShow
        });
    }

    handleShowToolbar() {
        const toolbarShow = !app.storage.toolbarShow;
        app.storage.toolbarShow = toolbarShow;

        this.setState({
            toolbarShow
        });
    }

    handleShowTimelinePanel() {
        const timelinePanelShow = !app.storage.timelinePanelShow;
        app.storage.timelinePanelShow = timelinePanelShow;

        this.setState({
            timelinePanelShow
        });
    }

    handleShowStatusBar() {
        const statusBarShow = !app.storage.statusBarShow;
        app.storage.statusBarShow = statusBarShow;

        this.setState({
            statusBarShow
        });
    }

    handleShowStats() {
        const showStats = !app.storage.showStats;
        app.storage.showStats = showStats;

        Object.assign(app.stats.dom.style, {
            display: showStats ? 'block' : 'none'
        });

        this.setState({
            showStats
        });
    }

    handleShowGrid() {
        const showGrid = !app.storage.showGrid;
        app.storage.showGrid = showGrid;

        this.setState({
            showGrid
        });
    }

    handleShowViewHelper() {
        const showViewHelper = !app.storage.showViewHelper;
        app.storage.showViewHelper = showViewHelper;

        this.setState({
            showViewHelper
        });
    }

    handleEnablePhysics() {
        const enablePhysics = !app.options.enablePhysics;
        app.options.enablePhysics = enablePhysics;
        app.call('optionChange', this, 'enablePhysics', enablePhysics);
        this.setState({
            enablePhysics
        });
    }

    handleEnableThrowBall() {
        const isThrowBall = !this.state.isThrowBall;
        app.call('enableThrowBall', this, isThrowBall);
        this.setState({
            isThrowBall
        });
    }
}

export default ViewMenu;