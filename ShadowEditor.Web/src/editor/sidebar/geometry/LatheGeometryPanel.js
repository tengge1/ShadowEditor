import UI from '../../../ui/UI';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 车床几何体面板
 * @author rfm1201
 * @author tengge / https://github.com/tengge1
 */
function LatheGeometryPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.object = options.object;
};

LatheGeometryPanel.prototype = Object.create(UI.Control.prototype);
LatheGeometryPanel.prototype.constructor = LatheGeometryPanel;

LatheGeometryPanel.prototype.render = function () {
    var editor = this.app.editor;
    var object = this.object;
    var geometry = object.geometry;
    var parameters = geometry.parameters;
    var lastPointIdx = 0;
    var pointsUI = [];

    var _this = this;

    this.children = [{
        xtype: 'row',
        parent: this.parent,
        children: [{ // segments
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '径向段数'
            }, {
                xtype: 'int',
                id: 'latheGeometrySegments',
                value: parameters.segments,
                onChange: update
            }]
        }, { // phiStart
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '开始角度'
            }, {
                xtype: 'number',
                id: 'latheGeometryPhiStart',
                value: parameters.phiStart * 180 / Math.PI,
                onChange: update
            }]
        }, { // phiLength
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '结束角度'
            }, {
                xtype: 'number',
                id: 'latheGeometryPhiLength',
                value: parameters.phiLength * 180 / Math.PI,
                onChange: update
            }]
        }, { // points
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '点'
            }, {
                xtype: 'span',
                id: 'latheGeometryPoints',
                style: {
                    display: 'inline-block'
                },
                children: [{
                    xtype: 'div',
                    id: 'latheGeometryPointsList',
                }]
            }]
        }]
    }];

    var container = UI.create(this.children[0]);
    container.render();

    var points = UI.get('latheGeometryPoints');
    var pointsList = UI.get('latheGeometryPointsList');

    var addPointButton = UI.create({
        xtype: 'button',
        text: '+',
        onClick: function () {
            if (pointsUI.length === 0) {
                pointsList.add(this.createPointRow(0, 0));
            } else {
                var point = pointsUI[pointsUI.length - 1];
                pointsList.add(this.createPointRow(point.x.getValue(), point.y.getValue()));
            }

            this.update();
        }
    });

    var createPointRow = function (x, y) {
        var pointRow = new UI.Div();

        var lbl = new UI.Text({
            text: lastPointIdx + 1,
            style: {
                width: '20px'
            }
        });

        var txtX = new UI.Number({
            value: x,
            range: [0, Infinity],
            style: {
                width: '40px'
            },
            onChange: update
        });

        var txtY = new UI.Number({
            value: y,
            style: {
                width: '40px'
            },
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

    var deletePointRow = function (idx) {

        if (!pointsUI[idx]) return;

        pointsList.remove(pointsUI[idx].row);
        pointsUI[idx] = null;

        update();

    }

    var update = function () {
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
};

export default LatheGeometryPanel;
