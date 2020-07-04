/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/TimelinePanel.css';

import { Timeline } from '../../ui/index';

/**
 * 时间轴面板
 * @author tengge / https://github.com/tengge1
 */
class TimelinePanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            animations: [],
            selectedLayer: null,
            selected: null
        };

        this.handleAddLayer = this.handleAddLayer.bind(this);
        this.commitAddLayer = this.commitAddLayer.bind(this);
        this.handleEditLayer = this.handleEditLayer.bind(this);
        this.commitEditLayer = this.commitEditLayer.bind(this);
        this.handleDeleteLayer = this.handleDeleteLayer.bind(this);
        this.commitDeleteLayer = this.commitDeleteLayer.bind(this);
        this.handleSelectedLayerChange = this.handleSelectedLayerChange.bind(this);

        this.handleAddAnimation = this.handleAddAnimation.bind(this);
        this.handleDropAnimation = this.handleDropAnimation.bind(this);
        this.handleClickAnimation = this.handleClickAnimation.bind(this);

        this.updateUI = this.updateUI.bind(this);
    }

    render() {
        const { animations, selectedLayer, selected } = this.state;

        return <Timeline
            className={'TimelinePanel'}
            animations={animations}
            selectedLayer={selectedLayer}
            selected={selected}

            onAddLayer={this.handleAddLayer}
            onEditLayer={this.handleEditLayer}
            onDeleteLayer={this.handleDeleteLayer}
            onSelectedLayerChange={this.handleSelectedLayerChange}

            onAddAnimation={this.handleAddAnimation}
            onDropAnimation={this.handleDropAnimation}
            onClickAnimation={this.handleClickAnimation}
               />;
    }

    componentDidMount() {
        app.on(`appStarted.TimelinePanel`, this.updateUI);
        app.on(`animationChanged.TimelinePanel`, this.updateUI);
    }

    updateUI() {
        this.setState({
            animations: app.editor.animations
        });
    }

    // ----------------------- 动画层管理 ------------------------------

    handleAddLayer() {
        app.prompt({
            title: _t('Input Layer Name'),
            content: _t('Layer Name'),
            value: _t('New Layer'),
            onOK: this.commitAddLayer
        });
    }

    commitAddLayer(layerName) {
        let animations = app.editor.animations;
        const layer = Math.max.apply(Math, animations.map(n => n.layer)) + 1;

        animations.push({
            id: null,
            layer,
            layerName: layerName,
            uuid: THREE.Math.generateUUID(),
            animations: []
        });

        app.call(`animationChanged`, this);
    }

    handleEditLayer(id) {
        if (!id) {
            app.toast(_t('Please select an animation layer.'));
            return;
        }

        const animations = app.editor.animations;

        const layer = animations.filter(n => n.uuid === id)[0];

        app.prompt({
            title: _t('Edit Layer Name'),
            content: _t('Layer Name'),
            value: layer.layerName,
            onOK: this.commitEditLayer
        });
    }

    commitEditLayer(layerName) {
        let animations = app.editor.animations;

        const index = animations.findIndex(n => n.uuid === this.state.selectedLayer);

        if (index > -1) {
            animations[index].layerName = layerName;

            app.call(`animationChanged`, this);
        }
    }

    handleDeleteLayer(id) {
        if (!id) {
            app.toast(_t('Please select an animation layer.'));
            return;
        }

        const animations = app.editor.animations;

        const layer = animations.filter(n => n.uuid === id)[0];

        app.confirm({
            title: _t('Delete'),
            content: _t(`Delete animation layer {{layerName}}?`, { layerName: layer.layerName }),
            onOK: this.commitDeleteLayer
        });
    }

    commitDeleteLayer() {
        let animations = app.editor.animations;

        const index = animations.findIndex(n => n.uuid === this.state.selectedLayer);

        if (index > -1) {
            animations.splice(index, 1);

            app.call(`animationChanged`, this);
        }
    }

    handleSelectedLayerChange(value) {
        this.setState({
            selectedLayer: value
        });
    }

    // ---------------------------- 动画管理 ---------------------------------

    handleAddAnimation(layerID, beginTime, endTime) {
        let layer = app.editor.animations.filter(n => n.uuid === layerID)[0];

        if (!layer) {
            console.warn(`TimelinePanel: layer ${layerID} is not defined.`);
            return;
        }

        layer.animations.push({
            id: null,
            uuid: THREE.Math.generateUUID(),
            name: _t('Animation'),
            target: null,
            type: 'Tween',
            beginTime,
            endTime,
            data: {
                beginStatus: 'Current', // 开始状态：Current-当前位置、Custom-自定义位置
                beginPositionX: 0,
                beginPositionY: 0,
                beginPositionZ: 0,
                beginRotationX: 0,
                beginRotationY: 0,
                beginRotationZ: 0,
                beginScaleLock: true,
                beginScaleX: 1.0,
                beginScaleY: 1.0,
                beginScaleZ: 1.0,
                ease: 'linear', // linear, quadIn, quadOut, quadInOut, cubicIn, cubicOut, cubicInOut, quartIn, quartOut, quartInOut, quintIn, quintOut, quintInOut, sineIn, sineOut, sineInOut, backIn, backOut, backInOut, circIn, circOut, circInOut, bounceIn, bounceOut, bounceInOut, elasticIn, elasticOut, elasticInOut
                endStatus: 'Current',
                endPositionX: 0,
                endPositionY: 0,
                endPositionZ: 0,
                endRotationX: 0,
                endRotationY: 0,
                endRotationZ: 0,
                endScaleLock: true,
                endScaleX: 1.0,
                endScaleY: 1.0,
                endScaleZ: 1.0
            }
        });

        app.call(`animationChanged`, this);
    }

    handleDropAnimation(id, oldLayerID, newLayerID, beginTime) {
        let oldLayer = app.editor.animations.filter(n => n.uuid === oldLayerID)[0];

        if (!oldLayer) {
            console.warn(`TimelinePanel: layer ${oldLayerID} is not defined.`);
            return;
        }

        let newLayer = app.editor.animations.filter(n => n.uuid === newLayerID)[0];

        if (!newLayer) {
            console.warn(`TimelinePanel: layer ${newLayerID} is not defined.`);
            return;
        }

        let index = oldLayer.animations.findIndex(n => n.uuid === id);

        if (index === -1) {
            console.warn(`TimelinePanel: animation ${id} is not defined.`);
            return;
        }

        let animation = oldLayer.animations[index];

        let duration = animation.endTime - animation.beginTime;

        animation.beginTime = beginTime;
        animation.endTime = beginTime + duration;

        oldLayer.animations.splice(index, 1);
        newLayer.animations.push(animation);

        app.call(`animationChanged`, this);
    }

    handleClickAnimation(id, pid) {
        const layer = app.editor.animations.filter(n => n.uuid === pid)[0];

        if (!layer) {
            console.warn(`TimelinePanel: layer ${pid} is not defined.`);
            return;
        }

        const animation = layer.animations.filter(n => n.uuid === id)[0];

        if (!animation) {
            console.warn(`TimelinePanel: animation ${id} is not defined.`);
            return;
        }

        app.call('animationSelected', this, animation);

        this.setState({
            selected: animation.uuid
        });
    }
}

export default TimelinePanel;