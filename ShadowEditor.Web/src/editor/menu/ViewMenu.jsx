import { MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 视图菜单
 * @author tengge / https://github.com/tengge1
 */
class ViewMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showStats: app.storage.get('showStats') === undefined ? true : app.storage.get('showStats'),
            showGrid: app.storage.get('showGrid') === undefined ? true : app.storage.get('showGrid'),
            showViewHelper: app.storage.get('showViewHelper') === undefined ? true : app.storage.get('showViewHelper'),
            enablePhysics: app.options.enablePhysics,
            isThrowBall: false
        };

        this.handleShowStats = this.handleShowStats.bind(this);
        this.handleShowGrid = this.handleShowGrid.bind(this);
        this.handleShowViewHelper = this.handleShowViewHelper.bind(this);

        this.handleEnablePhysics = this.handleEnablePhysics.bind(this);
        this.handleEnableThrowBall = this.handleEnableThrowBall.bind(this);
    }

    render() {
        const { showStats, showGrid, showViewHelper, enablePhysics, isThrowBall } = this.state;

        return <MenuItem title={_t('View')}>
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

    handleShowStats() {
        const showStats = !app.storage.get('showStats');
        app.storage.set('showStats', showStats);

        Object.assign(app.stats.dom.style, {
            display: showStats ? 'block' : 'none'
        });

        this.setState({
            showStats
        });
    }

    handleShowGrid() {
        const showGrid = !app.storage.get('showGrid');
        app.storage.set('showGrid', showGrid);

        app.call(`storageChanged`, this, 'showGrid', showGrid);

        this.setState({
            showGrid
        });
    }

    handleShowViewHelper() {
        const showViewHelper = !app.storage.get('showViewHelper');
        app.storage.set('showViewHelper', showViewHelper);

        app.call(`storageChanged`, this, 'showViewHelper', showViewHelper);

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