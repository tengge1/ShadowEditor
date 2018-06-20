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

    // ---------------- 菜单数据 ----------------------

    this.data = [{
        text: '场景',
        children: [{
            text: '新建',
            onClick: function () {
                app.call('mNewScene');
            }
        }, {
            text: '载入',
            onClick: function () {
                app.call('mLoadScene');
            }
        }, {
            text: '保存',
            onClick: function () {
                app.call('mSaveScene');
            }
        }, {
            text: '-'
        }, {
            text: '发布',
            onClick: function () {
                app.call('mPublishScene');
            }
        }]
    }, {
        text: '编辑',
        children: [{
            text: '撤销(Ctrl+Z)',
            onClick: function () {
                app.call('mUndo');
            }
        }, {
            text: '重做(Ctrl+Shift+Z)',
            onClick: function () {
                app.call('mRedo');
            }
        }, {
            text: '清空历史记录',
            onClick: function () {
                app.call('mClearHistory');
            }
        }, {
            text: '-'
        }, {
            text: '复制',
            onClick: function () {
                app.call('mClone');
            }
        }, {
            text: '删除(Del)',
            onClick: function () {
                app.call('mDelete');
            }
        }, {
            text: '删除着色器',
            onClick: function () {
                app.call('mMinifyShader');
            }
        }]
    }, {
        text: '添加',
        children: [{
            text: '组',
            onClick: function () {
                app.call('mAddGroup');
            }
        }, {
            text: '-'
        }, {
            text: '平板',
            onClick: function () {
                app.call('mAddPlane');
            }
        }, {
            text: '正方体',
            onClick: function () {
                app.call('mAddBox');
            }
        }, {
            text: '圆',
            onClick: function () {
                app.call('mAddCircle');
            }
        }, {
            text: '圆柱体',
            onClick: function () {
                app.call('mAddCylinder');
            }
        }, {
            text: '球体',
            onClick: function () {
                app.call('mAddSphere');
            }
        }, {
            text: '二十面体',
            onClick: function () {
                app.call('mAddIcosahedron');
            }
        }, {
            text: '轮胎',
            onClick: function () {
                app.call('mAddTorus');
            }
        }, {
            text: '扭结',
            onClick: function () {
                app.call('mAddTorusKnot');
            }
        }, {
            text: '茶壶',
            onClick: function () {
                app.call('mAddTeaport');
            }
        }, {
            text: '花瓶',
            onClick: function () {
                app.call('mAddLathe');
            }
        }, {
            text: '精灵',
            onClick: function () {
                app.call('mAddSprite');
            }
        }, {
            text: '-'
        }, {
            text: '点光源',
            onClick: function () {
                app.call('mAddPointLight');
            }
        }, {
            text: '聚光灯',
            onClick: function () {
                app.call('mAddSpotLight');
            }
        }, {
            text: '平行光源',
            onClick: function () {
                app.call('mAddDirectionalLight');
            }
        }, {
            text: '半球光',
            onClick: function () {
                app.call('mAddHemisphereLight');
            }
        }, {
            text: '环境光',
            onClick: function () {
                app.call('mAddAmbientLight');
            }
        }, {
            text: '-'
        }, {
            text: '透视相机',
            onClick: function () {
                app.call('mAddPerspectiveCamera');
            }
        }]
    }, {
        text: '资源',
        children: [{
            text: '导入',
            onClick: function () {
                app.call('mNewScene');
            }
        }, {
            text: '-'
        }, {
            text: '导出Geometry',
            onClick: function () {
                app.call('mExportGeometry');
            }
        }, {
            text: '导出Object',
            onClick: function () {
                app.call('mExportObject');
            }
        }, {
            text: '导出场景',
            onClick: function () {
                app.call('mExportScene');
            }
        }, {
            text: '导出OBJ',
            onClick: function () {
                app.call('mExportOBJ');
            }
        }, {
            text: '导出STL',
            onClick: function () {
                app.call('mExportSTL');
            }
        }]
    }, {
        text: '启动',
        onClick: function () {
            app.call('mPlay');
        }
    }, {
        text: '视图',
        children: [{
            text: 'VR模式',
            onClick: function () {
                app.call('mVRMode');
            }
        }]
    }, {
        text: '示例',
        children: [{
            text: '打砖块',
            onClick: function () {
                app.call('mArkanoid');
            }
        }, {
            text: '相机',
            onClick: function () {
                app.call('mCamera');
            }
        }, {
            text: '粒子',
            onClick: function () {
                app.call('mParticles');
            }
        }, {
            text: '乒乓球',
            onClick: function () {
                app.call('mPong');
            }
        }]
    }, {
        text: '帮助',
        children: [{
            text: '源码',
            onClick: function () {
                app.call('mSourceCode');
            }
        }, {
            text: '关于',
            onClick: function () {
                app.call('mAbout');
            }
        }]
    }];

    // --------------- 渲染生成dom ----------------------

    this.dom = new UI2.Panel({
        parent: this.app.container,
        id: 'menubar'
    });

    var _this = this;
    this.data.forEach(function (n) {
        var menu = new UI2.Panel({
            cls: 'menu'
        });

        // 菜单标题
        var title = new UI2.Panel({
            cls: 'title',
            html: n.text
        });
        menu.add(title);

        if (n.children) {
            // 下拉菜单
            var options = new UI2.Panel({
                cls: 'options'
            });
            menu.add(options);

            n.children.forEach(function (m) {
                if (m.text === '-') { // 分隔符
                    var hr = new UI2.HorizontalRule();
                    options.add(hr);
                } else { // 其他文字
                    var option = new UI2.Panel({
                        cls: 'option',
                        html: m.text
                    });
                    options.add(option);

                    // 菜单子项click事件
                    if (typeof (m.onClick) === 'function') {
                        option.onClick = m.onClick.bind(_this);
                    }
                }
            });
        }

        // 主菜单click事件
        if (typeof (n.onClick) === 'function') {
            menu.onClick = n.onClick.bind(_this);
        }

        _this.dom.add(menu);
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