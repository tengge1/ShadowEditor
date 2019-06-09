import './css/BorderLayout.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 边框布局
 * @author tengge / https://github.com/tengge1
 */
class BorderLayout extends React.Component {
    constructor(props) {
        super(props);

        const children = this.props.children;
        const north = children && children.filter(n => n.props.region === 'north')[0];
        const south = children && children.filter(n => n.props.region === 'south')[0];
        const west = children && children.filter(n => n.props.region === 'west')[0];
        const east = children && children.filter(n => n.props.region === 'east')[0];
        const center = children && children.filter(n => n.props.region === 'center')[0];

        const northSplit = north && north.props.split || false;
        const southSplit = south && south.props.split || false;
        const westSplit = west && west.props.split || false;
        const eastSplit = east && east.props.split || false;

        const northCollapsed = north && north.props.collapsed || false;
        const southCollapsed = south && south.props.collapsed || false;
        const westCollapsed = west && west.props.collapsed || false;
        const eastCollapsed = east && east.props.collapsed || false;

        this.state = {
            northSplit, southSplit, westSplit, eastSplit,
            northCollapsed, southCollapsed, westCollapsed, eastCollapsed,
        };

        this.handleNorthClick = this.handleNorthClick.bind(this);
        this.handleSouthClick = this.handleSouthClick.bind(this);
        this.handleWestClick = this.handleWestClick.bind(this);
        this.handleEastClick = this.handleEastClick.bind(this);
    }

    handleNorthClick() {
        if (!this.state.northSplit) {
            return;
        }
        this.setState((state, props) => ({
            northCollapsed: !state.northCollapsed,
        }));
    }

    handleSouthClick() {
        if (!this.state.southSplit) {
            return;
        }
        this.setState((state, props) => ({
            southCollapsed: !state.southCollapsed,
        }));
    }

    handleWestClick() {
        if (!this.state.westSplit) {
            return;
        }
        this.setState((state, props) => ({
            westCollapsed: !state.westCollapsed,
        }));
    }

    handleEastClick() {
        if (!this.state.eastSplit) {
            return;
        }
        this.setState((state, props) => ({
            eastCollapsed: !state.eastCollapsed,
        }));
    }

    render() {
        const { className, style, children, ...others } = this.props;

        const north = children && children.filter(n => n.props.region === 'north')[0];
        const south = children && children.filter(n => n.props.region === 'south')[0];
        const west = children && children.filter(n => n.props.region === 'west')[0];
        const east = children && children.filter(n => n.props.region === 'east')[0];
        const center = children && children.filter(n => n.props.region === 'center')[0];

        if (!center) {
            console.warn(`BorderLayout: center region is not defined.`);
        }

        // north region
        const northRegion = north && (<div className={classNames('north',
            this.state.northSplit && 'split',
            this.state.northCollapsed && 'collapsed')}>
            <div className={'content'}>
                {north}
            </div>
            {this.state.northSplit && <div className={'control'}>
                <div className={'button'} onClick={this.handleNorthClick}></div>
            </div>}
        </div>);

        // south region
        const southRegion = south && (<div className={classNames('south',
            this.state.northSplit && 'split',
            this.state.southCollapsed && 'collapsed')}>
            {this.state.southSplit && <div className={'control'}>
                <div className={'button'} onClick={this.handleSouthClick}></div>
            </div>}
            <div className={'content'}>
                {south}
            </div>
        </div>);

        // west region
        const westRegion = west && (<div className={classNames('west',
            this.state.westSplit && 'split',
            this.state.westCollapsed && 'collapsed')}>
            <div className={'content'}>
                {west}
            </div>
            {this.state.westSplit && <div className={'control'}>
                <div className={'button'} onClick={this.handleWestClick}></div>
            </div>}
        </div>);

        // east region
        const eastRegion = east && (<div className={classNames('east',
            this.state.eastSplit && 'split',
            this.state.eastCollapsed && 'collapsed')}>
            <div className={'control'}>
                <div className={'button'} onClick={this.handleEastClick}></div>
            </div>
            <div className={'content'}>
                {east}
            </div>
        </div>);

        // center region
        const centerRegion = center && (<div className={'center'}>
            {center}
        </div>);

        return <div
            className={classNames('BorderLayout', className)}
            style={style}
            {...others}>
            {northRegion}
            <div className={'middle'}>
                {westRegion}
                {centerRegion}
                {eastRegion}
            </div>
            {southRegion}
        </div>;
    }
}

BorderLayout.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
};

BorderLayout.defaultProps = {
    className: null,
    style: null,
    children: null,
};

export default BorderLayout;