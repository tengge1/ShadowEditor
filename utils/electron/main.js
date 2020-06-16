const path = require('path');
const { app, BrowserWindow } = require('electron');
const iconv = require('iconv-lite');

function startMongoDB() {

}

function startServer() {

}

function start() {
    let appPath = app.getPath('exe')
    console.log(appPath)
    // // 获取上一层的目录 app 是当前目录名称 需要给去掉
    // let path = appPath.replace(/\\app\\studio.exe/, '')

    var path1 = app.getAppPath();
    console.log(path1);

    const exec = require('child_process').exec

    // console.log(appPath);
    // console.log(path)

    // // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    var workerProcess = exec('build\\ShadowEditor.exe', { cwd: '.\\build', encoding: 'GBK' })
    // // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

    // // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data', function (data) {
        debugger
        console.log('stdout: ' + data)
    })

    // // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', buf => {
        debugger
        console.log(iconv.decode(buf, 'GBK'));
    })

    // // 退出之后的输出
    workerProcess.on('close', function (code) {
        debugger
        console.log('out code：' + code)
    })

    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // 加载index.html文件
    win.loadFile('index.html')
}

app.whenReady().then(start)