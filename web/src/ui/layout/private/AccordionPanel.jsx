/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/AccordionPanel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

/**
 * 单个折叠面板
 * @private
 * @author tengge / https://github.com/tengge1
 */
class AccordionPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            maximized: props.maximized
        };

        this.handleClick = this.handleClick.bind(this, props.onClick, props.index, props.name);
        this.handleMaximize = this.handleMaximize.bind(this, props.onMaximize);
    }

    handleClick(onClick, index, name, event) {
        onClick && onClick(index, name, event);
    }

    handleMaximize(onMaximize, event) {
        this.setState(state => ({
            maximized: !state.maximized
        }));

        onMaximize && onMaximize(event);
    }

    render() {
        const { title, className, style, children, show, total, collpased,
            maximizable } = this.props;

        const maximizeControl = maximizable && <div className={'control'}
            onClick={this.handleMaximize}
                                               >
            {this.state.maximized ? <i className={'iconfont icon-minimize'} /> : <i className={'iconfont icon-maximize'} />}
        </div>;

        const _style = collpased ? style : Object.assign({}, style, {
            height: `calc(100% - ${26 * (total - 1)}px`
        });

        return <div className={classNames('AccordionPanel',
            this.state.maximized && 'maximized',
            collpased && 'collpased',
            !show && 'hidden',
            className)}
            style={_style}
               >
            <div className={'header'}
                onClick={this.handleClick}
            >
                <span className="title">{title}</span>
                <div className="controls">
                    {maximizeControl}
                </div>
            </div>
            <div className={'body'}>
                {children}
            </div>
        </div>;
    }
}

AccordionPanel.propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    show: PropTypes.bool,
    total: PropTypes.number,
    index: PropTypes.number,
    collpased: PropTypes.bool,
    maximizable: PropTypes.bool,
    maximized: PropTypes.bool,
    onMaximize: PropTypes.bool,
    onClick: PropTypes.func
};

AccordionPanel.defaultProps = {
    name: null,
    title: null,
    className: null,
    style: null,
    children: null,
    show: true,
    total: 1,
    index: 0,
    collpased: true,
    maximizable: false,
    maximized: false,
    onMaximize: null,
    onClick: null
};

export default AccordionPanel;