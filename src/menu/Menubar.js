import FileMenu from './FileMenu';
import EditMenu from './EditMenu';
import AddMenu from './AddMenu';
import AssetMenu from './AssetMenu';
import PlayMenu from './PlayMenu';
import ExampleMenu from './ExampleMenu';
import HelpMenu from './HelpMenu';
import StatusMenu from './StatusMenu';
import ViewMenu from './ViewMenu';
import UI from '../ui/UI';
import UI2 from '../ui2/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */
function Menubar(app) {
    this.app = app;

    this.data = [{
        text: '文件',
        children: [{
            text: '新建',
            onClick: function () {

            }
        }, {
            text: '载入',
            onClick: function () {

            }
        }, {
            text: '保存',
            onClick: function () {

            }
        }, {
            text: '-'
        }, {
            text: '发布',
            onClick: function () {

            }
        }]
    }, {
        text: '编辑',
        children: [{
            text: '撤销(Ctrl+Z)',
            onClick: function () {

            }
        }, {
            text: '重做(Ctrl+Shift+Z)',
            onClick: function () {

            }
        }, {
            text: '清空历史记录',
            onClick: function () {

            }
        }, {
            text: '-'
        }, {
            text: '复制',
            onClick: function () {

            }
        }, {
            text: '删除(Del)',
            onClick: function () {

            }
        }, {
            text: '删除着色器',
            onClick: function () {

            }
        }]
    }, {
        text: '添加',
        children: [{
            text: '组',
            onClick: function () {

            }
        }, {
            text: '-'
        }, {
            text: '平板',
            onClick: function () {

            }
        }, {
            text: '正方体',
            onClick: function () {

            }
        }, {
            text: '圆',
            onClick: function () {

            }
        }, {
            text: '圆柱体',
            onClick: function () {

            }
        }, {
            text: '球体',
            onClick: function () {

            }
        }, {
            text: '二十面体',
            onClick: function () {

            }
        }, {
            text: '轮胎',
            onClick: function () {

            }
        }, {
            text: '扭结',
            onClick: function () {

            }
        }, {
            text: '茶壶',
            onClick: function () {

            }
        }, {
            text: '花瓶',
            onClick: function () {

            }
        }, {
            text: '精灵',
            onClick: function () {

            }
        }, {
            text: '-'
        }, {
            text: '点光源',
            onClick: function () {

            }
        }, {
            text: '聚光灯',
            onClick: function () {

            }
        }, {
            text: '平行光源',
            onClick: function () {

            }
        }, {
            text: '半球光',
            onClick: function () {

            }
        }, {
            text: '环境光',
            onClick: function () {

            }
        }, {
            text: '-'
        }, {
            text: '透视相机',
            onClick: function () {

            }
        }]
    }, {
        text: '资源',
        children: [{
            text: '导入',
            onClick: function () {

            }
        }, {
            text: '-'
        }, {
            text: '导出Geometry',
            onClick: function () {

            }
        }, {
            text: '导出Object',
            onClick: function () {

            }
        }, {
            text: '导出场景',
            onClick: function () {

            }
        }, {
            text: '导出OBJ',
            onClick: function () {

            }
        }, {
            text: '导出STL',
            onClick: function () {

            }
        }]
    }, {
        text: '启动',
        onClick: function () {

        }
    }, {
        text: '视图',
        children: [{
            text: 'VR模式',
            onClick: function () {

            }
        }]
    }, {
        text: '示例',
        children: [{
            text: '打砖块',
            onClick: function () {

            }
        }, {
            text: '相机',
            onClick: function () {

            }
        }, {
            text: '粒子',
            onClick: function () {

            }
        }, {
            text: '乒乓球',
            onClick: function () {

            }
        }]
    }, {
        text: '帮助',
        children: [{
            text: '源码',
            onClick: function () {

            }
        }, {
            text: '关于',
            onClick: function () {

            }
        }]
    }];

    this.dom = new UI2.Panel({
        parent: this.app.container
    });

    var _this = this;
    this.data.forEach(function (n) {
        var menu = new UI2.Panel({
            cls: 'menu'
        });

        var title = new UI2.Panel({
            cls: 'title',
            html: '添加'
        });

        menu.add(title);
        _this.dom.add(title);
    });

    this.dom.render();

    // var editor = this.app.editor;

    // var container = new UI.Panel();
    // container.setId('menubar');

    // container.add(new FileMenu(editor));
    // container.add(new EditMenu(editor));
    // container.add(new AddMenu(editor));
    // container.add(new AssetMenu(editor));
    // container.add(new PlayMenu(editor));
    // container.add(new ViewMenu(editor));
    // container.add(new ExampleMenu(editor));
    // container.add(new HelpMenu(editor));

    // container.add(new StatusMenu(editor));

    // return container;
};

export default Menubar;