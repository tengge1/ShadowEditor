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

        this.northRef = React.createRef();
        this.southRef = React.createRef();
        this.westRef = React.createRef();
        this.eastRef = React.createRef();

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

        this.setState((state, props) => {
            const collapsed = !state.northCollapsed;

            const dom = this.northRef.current;
            const height = dom.clientHeight;

            if (collapsed) {
                dom.style.marginTop = `-${height - 8}px`;
            } else {
                dom.style.marginTop = null;
            }

            return {
                northCollapsed: collapsed,
            };
        });
    }

    handleSouthClick() {
        if (!this.state.southSplit) {
            return;
        }

        this.setState((state, props) => {
            const collapsed = !state.southCollapsed;

            const dom = this.southRef.current;
            const height = dom.clientHeight;

            if (collapsed) {
                dom.style.marginBottom = `-${height - 8}px`;
            } else {
                dom.style.marginBottom = null;
            }

            return {
                southCollapsed: collapsed,
            };
        });
    }

    handleWestClick() {
        if (!this.state.westSplit) {
            return;
        }

        this.setState((state, props) => {
            const collapsed = !state.westCollapsed;

            const dom = this.westRef.current;
            const width = dom.clientWidth;

            if (collapsed) {
                dom.style.marginLeft = `-${width - 8}px`;
            } else {
                dom.style.marginLeft = null;
            }

            return {
                westCollapsed: collapsed,
            };
        });
    }

    handleEastClick() {
        if (!this.state.eastSplit) {
            return;
        }

        this.setState((state, props) => {
            const collapsed = !state.eastCollapsed;

            const dom = this.eastRef.current;
            const width = dom.clientWidth;

            if (collapsed) {
                dom.style.marginRight = `-${width - 8}px`;
            } else {
                dom.style.marginRight = null;
            }

            return {
                eastCollapsed: collapsed,
            };
        });
    }

    render() {
        const { className, style, children } = this.props;

        let north = [], south = [], west = [], east = [], center = [], others = [];

        children && children.forEach(n => {
            switch (n.props.region) {
                case 'north':
                    north.push(n);
                    break;
                case 'south':
                    south.push(n);
                    break;
                case 'west':
                    west.push(n);
                    break;
                case 'east':
                    east.push(n);
                    break;
                case 'center':
                    center.push(n);
                    break;
                default:
                    others.push(n);
                    break;
            }
        });

        if (center.length === 0) {
            console.warn(`BorderLayout: center region is not defined.`);
        }

        // north region
        const northRegion = north.length > 0 && (<div className={classNames('north',
            this.state.northSplit && 'split',
            this.state.northCollapsed && 'collapsed')}
            ref={this.northRef}>
            <div className={'content'}>
                {north}
            </div>
            {this.state.northSplit && <div className={'control'}>
                <div className={'button'} onClick={this.handleNorthClick}></div>
            </div>}
        </div>);

        // south region
        const southRegion = south.length > 0 && (<div className={classNames('south',
            this.state.northSplit && 'split',
            this.state.southCollapsed && 'collapsed')}
            ref={this.southRef}>
            {this.state.southSplit && <div className={'control'}>
                <div className={'button'} onClick={this.handleSouthClick}></div>
            </div>}
            <div className={'content'}>
                {south}
            </div>
        </div>);

        // west region
        const westRegion = west.length > 0 && (<div className={classNames('west',
            this.state.westSplit && 'split',
            this.state.westCollapsed && 'collapsed')}
            ref={this.westRef}>
            <div className={'content'}>
                {west}
            </div>
            {this.state.westSplit && <div className={'control'}>
                <div className={'button'} onClick={this.handleWestClick}></div>
            </div>}
        </div>);

        // east region
        const eastRegion = east.length > 0 && (<div className={classNames('east',
            this.state.eastSplit && 'split',
            this.state.eastCollapsed && 'collapsed')}
            ref={this.eastRef}>
            <div className={'control'}>
                <div className={'button'} onClick={this.handleEastClick}></div>
            </div>
            <div className={'content'}>
                {east}
            </div>
        </div>);

        // center region
        const centerRegion = center.length > 0 && (<div className={'center'}>
            {center}
        </div>);

        const otherRegion = others.length > 0 && others;

        return <div
            className={classNames('BorderLayout', className)}
            style={style}>
            {northRegion}
            <div className={'middle'}>
                {westRegion}
                {centerRegion}
                {eastRegion}
            </div>
            {southRegion}
            {otherRegion}
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