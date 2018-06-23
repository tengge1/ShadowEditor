import UI2 from '../ui2/UI';

/**
 * 菜单栏
 * @author mrdoob / http://mrdoob.com/
 */
function Menubar(app) {
    this.app = app;

    // ---------------- 菜单数据 ----------------------

    this.data = [{
        text: '场景',
        children: [{
            id: 'mNewScene',
            text: '新建',
            onClick: function () {
                app.call('mNewScene');
            }
        }, {
            id: 'mLoadScene',
            text: '载入',
            onClick: function () {
                app.call('mLoadScene');
            }
        }, {
            id: 'mSaveScene',
            text: '保存',
            onClick: function () {
                app.call('mSaveScene');
            }
        }, {
            text: '-'
        }, {
            id: 'mPublishScene',
            text: '发布',
            onClick: function () {
                app.call('mPublishScene');
            }
        }]
    }, {
        text: '编辑',
        children: [{
            id: 'mUndo',
            text: '撤销(Ctrl+Z)',
            onClick: function () {
                app.call('mUndo');
            }
        }, {
            id: 'mRedo',
            text: '重做(Ctrl+Shift+Z)',
            onClick: function () {
                app.call('mRedo');
            }
        }, {
            id: 'mClearHistory',
            text: '清空历史记录',
            onClick: function () {
                app.call('mClearHistory');
            }
        }, {
            text: '-'
        }, {
            id: 'mClone',
            text: '复制',
            onClick: function () {
                app.call('mClone');
            }
        }, {
            id: 'mDelete',
            text: '删除(Del)',
            onClick: function () {
                app.call('mDelete');
            }
        }, {
            id: 'mMinifyShader',
            text: '压缩着色器程序',
            onClick: function () {
                app.call('mMinifyShader');
            }
        }]
    }, {
        text: '添加',
        children: [{
            id: 'mAddGroup',
            text: '组',
            onClick: function () {
                app.call('mAddGroup');
            }
        }, {
            text: '-'
        }, {
            id: 'mAddPlane',
            text: '平板',
            onClick: function () {
                app.call('mAddPlane');
            }
        }, {
            id: 'mAddBox',
            text: '正方体',
            onClick: function () {
                app.call('mAddBox');
            }
        }, {
            id: 'mAddCircle',
            text: '圆',
            onClick: function () {
                app.call('mAddCircle');
            }
        }, {
            id: 'mAddCylinder',
            text: '圆柱体',
            onClick: function () {
                app.call('mAddCylinder');
            }
        }, {
            id: 'mAddSphere',
            text: '球体',
            onClick: function () {
                app.call('mAddSphere');
            }
        }, {
            id: 'mAddIcosahedron',
            text: '二十面体',
            onClick: function () {
                app.call('mAddIcosahedron');
            }
        }, {
            id: 'mAddTorus',
            text: '轮胎',
            onClick: function () {
                app.call('mAddTorus');
            }
        }, {
            id: 'mAddTorusKnot',
            text: '扭结',
            onClick: function () {
                app.call('mAddTorusKnot');
            }
        }, {
            id: 'mAddTeaport',
            text: '茶壶',
            onClick: function () {
                app.call('mAddTeaport');
            }
        }, {
            id: 'mAddLathe',
            text: '花瓶',
            onClick: function () {
                app.call('mAddLathe');
            }
        }, {
            id: 'mAddSprite',
            text: '精灵',
            onClick: function () {
                app.call('mAddSprite');
            }
        }, {
            text: '-'
        }, {
            id: 'mAddPointLight',
            text: '点光源',
            onClick: function () {
                app.call('mAddPointLight');
            }
        }, {
            id: 'mAddSpotLight',
            text: '聚光灯',
            onClick: function () {
                app.call('mAddSpotLight');
            }
        }, {
            id: 'mAddDirectionalLight',
            text: '平行光源',
            onClick: function () {
                app.call('mAddDirectionalLight');
            }
        }, {
            id: 'mAddHemisphereLight',
            text: '半球光',
            onClick: function () {
                app.call('mAddHemisphereLight');
            }
        }, {
            id: 'mAddAmbientLight',
            text: '环境光',
            onClick: function () {
                app.call('mAddAmbientLight');
            }
        }, {
            text: '-'
        }, {
            id: 'mAddPerspectiveCamera',
            text: '透视相机',
            onClick: function () {
                app.call('mAddPerspectiveCamera');
            }
        }]
    }, {
        text: '资源',
        children: [{
            id: 'mImportAsset',
            text: '导入',
            onClick: function () {
                app.call('mImportAsset');
            }
        }, {
            text: '-'
        }, {
            id: 'mExportGeometry',
            text: '导出Geometry',
            onClick: function () {
                app.call('mExportGeometry');
            }
        }, {
            id: 'mExportObject',
            text: '导出Object',
            onClick: function () {
                app.call('mExportObject');
            }
        }, {
            id: 'mExportScene',
            text: '导出场景',
            onClick: function () {
                app.call('mExportScene');
            }
        }, {
            id: 'mExportOBJ',
            text: '导出OBJ',
            onClick: function () {
                app.call('mExportOBJ');
            }
        }, {
            id: 'mExportSTL',
            text: '导出STL',
            onClick: function () {
                app.call('mExportSTL');
            }
        }]
    }, {
        id: 'mPlay',
        text: '启动',
        onClick: function () {
            app.call('mPlay');
        }
    }, {
        text: '视图',
        children: [{
            id: 'mVRMode',
            text: 'VR模式',
            onClick: function () {
                app.call('mVRMode');
            }
        }]
    }, {
        text: '示例',
        children: [{
            id: 'mArkanoid',
            text: '打砖块',
            onClick: function () {
                app.call('mArkanoid');
            }
        }, {
            id: 'mCamera',
            text: '相机',
            onClick: function () {
                app.call('mCamera');
            }
        }, {
            id: 'mParticles',
            text: '粒子',
            onClick: function () {
                app.call('mParticles');
            }
        }, {
            id: 'mPong',
            text: '乒乓球',
            onClick: function () {
                app.call('mPong');
            }
        }]
    }, {
        text: '帮助',
        children: [{
            id: 'mSourceCode',
            text: '源码',
            onClick: function () {
                app.call('mSourceCode');
            }
        }, {
            id: 'mAbout',
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
            id: n.id,
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
                        id: m.id,
                        cls: 'option',
                        html: m.text
                    });
                    options.add(option);

                    // 菜单子项click事件
                    if (typeof (m.onClick) === 'function') {
                        option.onClick = m.onClick; // this是具体菜单对应的Panel
                    }
                }
            });
        }

        // 主菜单click事件
        if (typeof (n.onClick) === 'function') {
            menu.onClick = n.onClick; // this是具体菜单对应的Panel
        }

        _this.dom.add(menu);
    });

    // 状态菜单
    var statusMenu = new UI2.Panel({
        id: 'mStatus',
        cls: 'menu right'
    });

    var autosave = new UI2.Boolean({
        text: '自动保存',
        value: this.app.editor.config.getKey('autosave'),
        style: 'color: #888 !important;'
    });
    statusMenu.add(autosave);

    var version = new UI2.Text({
        text: 'r' + THREE.REVISION,
        cls: 'title',
        style: 'opacity: 0.5'
    });
    statusMenu.add(version);

    this.dom.add(statusMenu);

    this.dom.render();
};

export default Menubar;