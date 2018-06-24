import UI2 from '../ui2/UI';

/**
 * 状态栏
 * @author mrdoob / http://mrdoob.com/
 */
function StatusBar(app) {
    this.app = app;

    this.container = new UI2.Div({
        parent: this.app.container,
        id: 'toolbar'
    });

    this.buttons = new UI2.Div();
    this.container.add(this.buttons);

    // 平移
    var _this = this;
    this.translateBtn = new UI2.Button({
        id: 'translateBtn',
        text: '平移',
        cls: 'Button selected',
        title: 'W',
        onClick: function () {
            _this.app.call('transformModeChanged', _this, 'translate');
        }
    });
    this.buttons.add(this.translateBtn);

    // 旋转
    this.rotateBtn = new UI2.Button({
        id: 'rotateBtn',
        text: '旋转',
        title: 'E',
        onClick: function () {
            _this.app.call('transformModeChanged', _this, 'rotate');
        }
    });
    this.buttons.add(this.rotateBtn);

    // 缩放
    this.scaleBtn = new UI2.Button({
        id: 'scaleBtn',
        text: '缩放',
        title: 'R',
        onClick: function () {
            _this.app.call('transformModeChanged', _this, 'scale');
        }
    });
    this.buttons.add(this.scaleBtn);

    // 网格数量
    this.grid = new UI2.Number({
        value: 25,
        style: 'width: 40px',
        onChange: function () {
            _this.app.call('gridChange', _this, this);
        }
    });
    this.buttons.add(new UI2.Text({ text: '网格：' }));
    this.buttons.add(this.grid);

    // 单元格
    this.snap = new UI2.Boolean({
        value: false,
        text: '单元',
        onChange: function () {
            _this.app.call('gridChange', _this, this);
        }
    });
    this.buttons.add(this.snap);

    // 坐标系类型
    this.local = new UI2.Boolean({
        value: false,
        text: '本地',
        onChange: function () {
            _this.app.call('gridChange', _this, this);
        }
    });
    this.buttons.add(this.local);

    // 显示 / 隐藏网格
    this.showGrid = new UI2.Boolean({
        value: true,
        text: '网格',
        onChange: function () {
            _this.app.call('gridChange', _this, this);
        }
    });
    this.buttons.add(this.showGrid);

    this.container.render();
};

export default StatusBar;