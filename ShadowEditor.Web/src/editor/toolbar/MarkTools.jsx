import { ToolbarSeparator, IconButton } from '../../third_party';

/**
 * 标注工具
 * @author tengge / https://github.com/tengge1
 */
class MarkTools extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAddPointMark: false,
            isAddLineMark: false,
            isAddPolygonMark: false
        };

        this.handleStartPointMarkTool = this.handleStartPointMarkTool.bind(this);
        this.handleStartLineMarkTool = this.handleStartLineMarkTool.bind(this);
        this.handleStartPolygonMarkTool = this.handleStartPolygonMarkTool.bind(this);
    }

    render() {
        const { isAddPointMark, isAddLineMark, isAddPolygonMark } = this.state;

        return <>
            <IconButton
                icon={'point-mark'}
                title={_t('Point Mark')}
                selected={isAddPointMark}
                onClick={this.handleStartPointMarkTool}
            />
            <IconButton
                icon={'line-mark'}
                title={_t('Line Mark')}
                selected={isAddLineMark}
                onClick={this.handleStartLineMarkTool}
            />
            <IconButton
                icon={'polygon-mark'}
                title={_t('Polygon Mark')}
                selected={isAddPolygonMark}
                onClick={this.handleStartPolygonMarkTool}
            />
            <ToolbarSeparator />
        </>;
    }

    handleStartPointMarkTool() {

    }

    handleStartLineMarkTool() {

    }

    handleStartPolygonMarkTool() {

    }
}

export default MarkTools;