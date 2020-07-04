/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
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
        const north = children && children.filter(n => n && n.props.region === 'north')[0];
        const south = children && children.filter(n => n && n.props.region === 'south')[0];
        const west = children && children.filter(n => n && n.props.region === 'west')[0];
        const east = children && children.filter(n => n && n.props.region === 'east')[0];

        const northSplit = north && north.props.split || false;
        const southSplit = south && south.props.split || false;
        const westSplit = west && west.props.split || false;
        const eastSplit = east && east.props.split || false;

        const northCollapsed = north && north.props.collapsed || false;
        const southCollapsed = south && south.props.collapsed || false;
        const westCollapsed = west && west.props.collapsed || false;
        const eastCollapsed = east && east.props.collapsed || false;

        const onNorthToggle = north && north.props.onToggle || null;
        const onSouthToggle = south && south.props.onToggle || null;
        const onWestToggle = west && west.props.onToggle || null;
        const onEastToggle = east && east.props.onToggle || null;

        this.northRef = React.createRef();
        this.southRef = React.createRef();
        this.westRef = React.createRef();
        this.eastRef = React.createRef();

        this.state = {
            northSplit, southSplit, westSplit, eastSplit,
            northCollapsed, southCollapsed, westCollapsed, eastCollapsed
        };

        this.handleNorthClick = this.handleNorthClick.bind(this, onNorthToggle);
        this.handleSouthClick = this.handleSouthClick.bind(this, onSouthToggle);
        this.handleWestClick = this.handleWestClick.bind(this, onWestToggle);
        this.handleEastClick = this.handleEastClick.bind(this, onEastToggle);

        this.handleTransitionEnd = this.handleTransitionEnd.bind(this, onNorthToggle, onSouthToggle, onWestToggle, onEastToggle);
    }

    handleNorthClick() {
        if (!this.state.northSplit) {
            return;
        }

        this.setState((state) => {
            const collapsed = !state.northCollapsed;

            const dom = this.northRef.current;
            const height = dom.clientHeight;

            if (collapsed) {
                dom.style.marginTop = `-${height - 8}px`;
            } else {
                dom.style.marginTop = null;
            }

            return {
                northCollapsed: collapsed
            };
        });
    }

    handleSouthClick() {
        if (!this.state.southSplit) {
            return;
        }

        this.setState((state) => {
            const collapsed = !state.southCollapsed;

            const dom = this.southRef.current;
            const height = dom.clientHeight;

            if (collapsed) {
                dom.style.marginBottom = `-${height - 8}px`;
            } else {
                dom.style.marginBottom = null;
            }

            return {
                southCollapsed: collapsed
            };
        });
    }

    handleWestClick() {
        if (!this.state.westSplit) {
            return;
        }

        const dom = this.westRef.current;

        this.setState((state) => {
            const collapsed = !state.westCollapsed;

            const width = dom.clientWidth;

            if (collapsed) {
                dom.style.marginLeft = `-${width - 8}px`;
            } else {
                dom.style.marginLeft = null;
            }

            return {
                westCollapsed: collapsed
            };
        });
    }

    handleEastClick() {
        if (!this.state.eastSplit) {
            return;
        }

        this.setState((state) => {
            const collapsed = !state.eastCollapsed;

            const dom = this.eastRef.current;
            const width = dom.clientWidth;

            if (collapsed) {
                dom.style.marginRight = `-${width - 8}px`;
            } else {
                dom.style.marginRight = null;
            }

            return {
                eastCollapsed: collapsed
            };
        });
    }

    handleTransitionEnd(onNorthToggle, onSouthToggle, onWestToggle, onEastToggle, event) {
        const region = event.target.getAttribute('region');

        switch (region) {
            case 'north':
                onNorthToggle && onNorthToggle(!this.state.northCollapsed);
                break;
            case 'south':
                onSouthToggle && onSouthToggle(!this.state.southCollapsed);
                break;
            case 'west':
                onWestToggle && onWestToggle(!this.state.westCollapsed);
                break;
            case 'east':
                onEastToggle && onEastToggle(!this.state.eastCollapsed);
                break;
        }
    }

    render() {
        const { className, style, children } = this.props;

        let north = [], south = [], west = [], east = [], center = [], others = [];

        children && children.forEach(n => {
            if(!n) {
                return;
            }
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
        const northRegion = north.length > 0 && <div className={classNames('north',
            this.state.northSplit && 'split',
            this.state.northCollapsed && 'collapsed',
            north.every(n => n.props.show === false) && 'hidden')}
            region={'north'}
            onTransitionEnd={this.handleTransitionEnd}
            ref={this.northRef}
                                                >
            <div className={'content'}>
                {north}
            </div>
            {this.state.northSplit && <div className={'control'}>
                <div className={'button'}
                    onClick={this.handleNorthClick}
                />
            </div>}
        </div>;

        // south region
        const southRegion = south.length > 0 && <div className={classNames('south',
            this.state.northSplit && 'split',
            this.state.southCollapsed && 'collapsed',
            south.every(n => n.props.show === false) && 'hidden')}
            region={'south'}
            onTransitionEnd={this.handleTransitionEnd}
            ref={this.southRef}
                                                >
            {this.state.southSplit && <div className={'control'}>
                <div className={'button'}
                    onClick={this.handleSouthClick}
                />
            </div>}
            <div className={'content'}>
                {south}
            </div>
        </div>;

        // west region
        const westRegion = west.length > 0 && <div className={classNames('west',
            this.state.westSplit && 'split',
            this.state.westCollapsed && 'collapsed',
            west.every(n => n.props.show === false) && 'hidden')}
            region={'west'}
            onTransitionEnd={this.handleTransitionEnd}
            ref={this.westRef}
                                              >
            <div className={'content'}>
                {west}
            </div>
            {this.state.westSplit && <div className={'control'}>
                <div className={'button'}
                    onClick={this.handleWestClick}
                />
            </div>}
        </div>;

        // east region
        const eastRegion = east.length > 0 && <div className={classNames('east',
            this.state.eastSplit && 'split',
            this.state.eastCollapsed && 'collapsed',
            east.every(n => n.props.show === false) && 'hidden')}
            region={'east'}
            onTransitionEnd={this.handleTransitionEnd}
            ref={this.eastRef}
                                              >
            <div className={'control'}>
                <div className={'button'}
                    onClick={this.handleEastClick}
                />
            </div>
            <div className={'content'}>
                {east}
            </div>
        </div>;

        // center region
        const centerRegion = center.length > 0 && <div className={'center'}>
            {center}
        </div>;

        const otherRegion = others.length > 0 && others;

        return <div
            className={classNames('BorderLayout', className)}
            style={style}
               >
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
    children: PropTypes.node
};

BorderLayout.defaultProps = {
    className: null,
    style: null,
    children: null
};

export default BorderLayout;