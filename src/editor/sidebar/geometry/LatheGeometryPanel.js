import Control from '../../../ui/Control';
import XType from '../../../ui/XType';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 车床几何体面板
 * @author rfm1201
 */
function LatheGeometryPanel(options) {
    Control.call(this, options);
    this.app = options.app;
    this.object = options.object;
};

LatheGeometryPanel.prototype = Object.create(Control.prototype);
LatheGeometryPanel.prototype.constructor = LatheGeometryPanel;

LatheGeometryPanel.prototype.render = function () {
    var editor = this.app.editor;
    var object = this.object;
    var geometry = object.geometry;
    var parameters = geometry.parameters;
    var _this = this;

    var container = new UI.Row();

    var geometry = object.geometry;
    var parameters = geometry.parameters;

    // segments

    var segmentsRow = new UI.Row();
    var segments = new UI.Integer({
        value: parameters.segments,
        onChange: update
    });

    segmentsRow.add(new UI.Label({
        text: '径向段数'
    }));

    segmentsRow.add(segments);

    container.add(segmentsRow);

    // phiStart

    var phiStartRow = new UI.Row();

    var phiStart = new UI.Number({
        value: parameters.phiStart * 180 / Math.PI,
        onChange: update
    });

    phiStartRow.add(new UI.Label({
        text: '开始角度'
    }));

    phiStartRow.add(phiStart);

    container.add(phiStartRow);

    // phiLength

    var phiLengthRow = new UI.Row();

    var phiLength = new UI.Number({
        value: parameters.phiLength * 180 / Math.PI,
        onChange: update
    });

    phiLengthRow.add(new UI.Label({
        text: '结束角度'
    }));

    phiLengthRow.add(phiLength);

    container.add(phiLengthRow);

    // points

    var lastPointIdx = 0;
    var pointsUI = [];

    var pointsRow = new UI.Row();

    pointsRow.add(new UI.Label({
        text: '点'
    }));

    var points = new UI.Span({
        style: 'display: inline-block;'
    });

    pointsRow.add(points);

    var pointsList = new UI.Div();

    points.add(pointsList);

    for (var i = 0; i < parameters.points.length; i++) {

        var point = parameters.points[i];
        pointsList.add(createPointRow(point.x, point.y));

    }

    var addPointButton = new UI.Button({
        text: '+',
        onClick: function () {
            if (pointsUI.length === 0) {
                pointsList.add(createPointRow(0, 0));
            } else {
                var point = pointsUI[pointsUI.length - 1];
                pointsList.add(createPointRow(point.x.getValue(), point.y.getValue()));
            }

            update();
        }
    });

    points.add(addPointButton);

    container.add(pointsRow);

    //

    function createPointRow(x, y) {

        var pointRow = new UI.Div();

        var lbl = new UI.Text({
            text: lastPointIdx + 1,
            style: 'width: 20px;'
        });

        var txtX = new UI.Number({
            value: x,
            range: [0, Infinity],
            style: 'width: 40px;',
            onChange: update
        });

        var txtY = new UI.Number({
            value: y,
            style: 'width: 40px;',
            onChange: update
        });

        var idx = lastPointIdx;

        var btn = new UI.Button({
            text: '-',
            onClick: function () {
                deletePointRow(idx);
            }
        });

        pointsUI.push({ row: pointRow, lbl: lbl, x: txtX, y: txtY });
        lastPointIdx++;

        pointRow.add(lbl);
        pointRow.add(txtX);
        pointRow.add(txtY);
        pointRow.add(btn);

        pointRow.render();

        return pointRow;

    }

    function deletePointRow(idx) {

        if (!pointsUI[idx]) return;

        pointsList.remove(pointsUI[idx].row);
        pointsUI[idx] = null;

        update();

    }

    function update() {

        var points = [];
        var count = 0;

        for (var i = 0; i < pointsUI.length; i++) {

            var pointUI = pointsUI[i];

            if (!pointUI) continue;

            points.push(new THREE.Vector2(pointUI.x.getValue(), pointUI.y.getValue()));
            count++;
            pointUI.lbl.setValue(count);

        }

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            points,
            segments.getValue(),
            phiStart.getValue() / 180 * Math.PI,
            phiLength.getValue() / 180 * Math.PI
        )));

    }

    container.render();
};

export default LatheGeometryPanel;
