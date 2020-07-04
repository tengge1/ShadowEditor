/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * 服务端功能
 * @author tengge / https://github.com/tengge1
 */
class Server {
    constructor(server) {
        this.origin = server;

        this.enableAuthority = false; // 是否开启权限
        this.initialized = false; // 系统是否初始化

        this.isLogin = false; // 是否登录
        this.username = ''; // 登录用户名
        this.name = ''; // 登录姓名

        this.roleName = ''; // 角色名称
        this.deptName = ''; // 机构名称
        this.authorities = []; // 权限列表

        this.isAdmin = false; // 是否是管理员

        this.enableRemoteEdit = false;
        this.webSocketServerPort = 5000;
    }

    load() {
        return new Promise(resolve => {
            fetch(`${this.origin}/api/Config/Get`).then(response => {
                response.json().then(obj => {
                    if (obj.Code !== 200) {
                        app.toast(_t(obj.Msg), 'warn');
                        return;
                    }
                    this.enableAuthority = obj.Data.EnableAuthority;
                    this.initialized = obj.Data.Initialized;

                    this.isLogin = obj.Data.IsLogin;
                    this.username = obj.Data.Username;
                    this.name = obj.Data.Name;

                    this.roleName = obj.Data.RoleName;
                    this.deptName = obj.Data.DeptName;
                    this.authorities = obj.Data.OperatingAuthorities;

                    this.isAdmin = this.roleName === 'Administrator';

                    this.enableRemoteEdit = obj.Data.EnableRemoteEdit;
                    this.webSocketServerPort = obj.Data.WebSocketServerPort;
                    resolve();
                }).catch(e => {
                    console.warn(e);
                    app.toast(_t('Server configuration acquisition failed.'), 'error');
                    resolve();
                });
            }).catch(e => {
                console.warn(e);
                app.toast(_t('Server configuration acquisition failed.'), 'error');
                resolve();
            });
        });
    }

    login(username, password) {
        return new Promise(resolve => {
            fetch(`${this.origin}/api/Login/Login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `Username=${username}&Password=${password}`
            }).then(response => {
                response.json().then(obj => {
                    if (obj.Code !== 200) {
                        app.toast(_t(obj.Msg), 'warn');
                        resolve(false);
                        return;
                    }
                    this.isLogin = true;
                    this.username = obj.Data.Username;
                    this.name = obj.Data.Name;

                    // TODO: 登录后返回所有信息
                    // this.roleName = ''; // 角色名称
                    // this.deptName = ''; // 机构名称
                    // this.authorities = []; // 权限列表
                    // this.authorities = obj.Data.OperatingAuthorities;

                    // this.isAdmin = false; // 是否是管理员

                    app.call('login', this);
                    resolve(true);
                });
            });
        });
    }

    logout() {
        return new Promise(resolve => {
            fetch(`${this.origin}/api/Login/Logout`, {
                method: 'POST'
            }).then(response => {
                response.json().then(obj => {
                    if (obj.Code !== 200) {
                        app.toast(_t(obj.Msg), 'warn');
                        resolve(false);
                        return;
                    }
                    this.isLogin = false;
                    this.username = '';
                    this.name = '';
                    app.call('logout', this);
                    resolve(true);
                });
            });
        });
    }
}

export default Server;