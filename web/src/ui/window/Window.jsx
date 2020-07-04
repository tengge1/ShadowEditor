/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Window.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Content from '../common/Content.jsx';
import Buttons from '../common/Buttons.jsx';

/**
 * 窗口
 */
class Window extends React.Component {
    constructor(props) {
        super(props);

        this.dom = React.createRef();

        this.isDown = false;
        this.offsetX = 0;
        this.offsetY = 0;

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleClose = this.handleClose.bind(this, props.onClose);
    }

    render() {
        const { className, style, title, children, hidden, mask } = this.props;

        let _children = null;

        if (children && Array.isArray(children)) {
            _children = children;
        } else if (children) {
            _children = [children];
        }

        const content = _children.filter(n => {
            return n.type === Content;
        })[0];

        const buttons = _children.filter(n => {
            return n.type === Buttons;
        })[0];

        return <div className={classNames('WindowMask', mask && 'mask', hidden && 'hidden')}>
            <div className={classNames('Window', className)}
                style={style}
                ref={this.dom}
            >
                <div className={'wrap'}>
                    <div className={'title'}
                        onMouseDown={this.handleMouseDown}
                    >
                        <span>{title}</span>
                        <div className={'controls'}>
                            <i className={'iconfont icon-close icon'}
                                onClick={this.handleClose}
                            />
                        </div>
                    </div>
                    <div className={'content'}>{content && content.props.children}</div>
                    {buttons && <div className={'buttons'}>
                        <div className={'button-wrap'}>
                            {buttons && buttons.props.children}
                        </div>
                    </div>}
                </div>
            </div>
        </div>;
    }

    handleMouseDown(event) {
        this.isDown = true;

        var dom = this.dom.current;
        var left = dom.style.left === '' ? 0 : parseInt(dom.style.left.replace('px', ''));
        var top = dom.style.top === '' ? 0 : parseInt(dom.style.top.replace('px', ''));

        this.offsetX = event.clientX - left;
        this.offsetY = event.clientY - top;
    }

    handleMouseMove(event) {
        if (!this.isDown) {
            return;
        }

        var dx = event.clientX - this.offsetX;
        var dy = event.clientY - this.offsetY;

        var dom = this.dom.current;
        dom.style.left = `${dx}px`;
        dom.style.top = `${dy}px`;
    }

    handleMouseUp() {
        this.isDown = false;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    handleClose(onClose, event) {
        onClose && onClose(event);
    }

    componentDidMount() {
        document.body.addEventListener('mousemove', this.handleMouseMove);
        document.body.addEventListener('mouseup', this.handleMouseUp);
    }

    componentWillUnmount() {
        document.body.removeEventListener('mousemove', this.handleMouseMove);
        document.body.removeEventListener('mouseup', this.handleMouseUp);
    }
}

Window.show = function () {

};

Window.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    children: PropTypes.node,
    hidden: PropTypes.bool,
    mask: PropTypes.bool,
    onClose: PropTypes.func
};

Window.defaultProps = {
    className: null,
    style: null,
    title: 'Window',
    children: null,
    hidden: false,
    mask: true,
    onClose: null
};

export default Window;