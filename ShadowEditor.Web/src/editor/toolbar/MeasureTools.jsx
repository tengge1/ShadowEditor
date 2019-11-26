import { ToolbarSeparator, IconButton, ImageButton } from '../../third_party';

/**
 * 测量工具
 * @author tengge / https://github.com/tengge1
 */
class MeasureTools extends React.Component {
    constructor(props) {
        super(props);

        this.handleMeasureDistance = this.handleMeasureDistance.bind(this);
        this.handleMeasureArea = this.handleMeasureArea.bind(this);
        this.handleMeasureAngle = this.handleMeasureAngle.bind(this);
    }

    render() {
        return <>
            <IconButton
                icon={'distance'}
                title={_t('Measure Distance')}
                onClick={this.handleMeasureDistance}
            />
            <IconButton
                icon={'area'}
                title={_t('Measure Area')}

                onClick={this.handleMeasureArea}
            />
            <IconButton
                icon={'angle'}
                title={_t('Measure Angle')}
                onClick={this.handleMeasureAngle}
            />
            <ToolbarSeparator />
        </>;
    }

    handleMeasureDistance() {

    }

    handleMeasureArea() {

    }

    handleMeasureAngle() {

    }
}

export default MeasureTools;