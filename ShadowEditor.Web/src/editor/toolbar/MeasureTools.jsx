import { ToolbarSeparator, IconButton } from '../../third_party';
import DistanceTool from '../tools/DistanceTool';

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
        this.handleMeasureAngle = this.handleMeasureAngle.bind(this);
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

    }

    // --------------------------- 角度测量 ---------------------------------------

    handleMeasureAngle() {

    }
}

export default MeasureTools;