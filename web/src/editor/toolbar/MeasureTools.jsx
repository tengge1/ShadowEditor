/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { ToolbarSeparator, IconButton } from '../../ui/index';
import DistanceTool from '../tools/DistanceTool';
import AreaTool from '../tools/AreaTool';

/**
 * 测量工具
 * @author tengge / https://github.com/tengge1
 */
class MeasureTools extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            distanceToolEnabled: false,
            areaToolEnabled: false,
            angleToolEnabled: false
        };

        this.handleMeasureDistance = this.handleMeasureDistance.bind(this);
        this.handleEndMeasureDistance = this.handleEndMeasureDistance.bind(this);
        this.handleMeasureArea = this.handleMeasureArea.bind(this);
        this.handleEndMeasureArea = this.handleEndMeasureArea.bind(this);
        this.handleMeasureAngle = this.handleMeasureAngle.bind(this);
        this.handleClearTools = this.handleClearTools.bind(this);
    }

    render() {
        const { distanceToolEnabled, areaToolEnabled, angleToolEnabled } = this.state;

        return <>
            <IconButton
                icon={'distance'}
                title={_t('Measure Distance')}
                selected={distanceToolEnabled}
                onClick={this.handleMeasureDistance}
            />
            <IconButton
                icon={'area'}
                title={_t('Measure Area')}
                selected={areaToolEnabled}
                onClick={this.handleMeasureArea}
            />
            <IconButton
                icon={'angle'}
                title={_t('Measure Angle')}
                selected={angleToolEnabled}
                onClick={this.handleMeasureAngle}
            />
            <ToolbarSeparator />
            <IconButton
                icon={'delete'}
                title={_t('Clear Tools')}
                onClick={this.handleClearTools}
            />
            <ToolbarSeparator />
        </>;
    }

    // ----------------------------- 距离测量 ------------------------------------

    handleMeasureDistance() {
        if (this.distanceTool === undefined) {
            this.distanceTool = new DistanceTool();
            this.distanceTool.on(`end.${this.id}`, this.handleEndMeasureDistance);
        }
        this.distanceTool.start();
        this.setState({
            distanceToolEnabled: true
        });
        app.toast(_t('Start distance measurement.'));
    }

    handleEndMeasureDistance() {
        this.setState({
            distanceToolEnabled: false
        });
    }

    // --------------------------- 面积测量 -------------------------------------

    handleMeasureArea() {
        if (this.areaTool === undefined) {
            this.areaTool = new AreaTool();
            this.areaTool.on(`end.${this.id}`, this.handleEndMeasureArea);
        }
        this.areaTool.start();
        this.setState({
            areaToolEnabled: true
        });
        app.toast(_t('Start area measurement.'));
    }

    handleEndMeasureArea() {
        this.setState({
            areaToolEnabled: false
        });
    }

    // --------------------------- 角度测量 ---------------------------------------

    handleMeasureAngle() {

    }

    // --------------------------- 清空工具 ---------------------------------------

    handleClearTools() {

    }
}

export default MeasureTools;