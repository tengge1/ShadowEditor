const fs = require('fs');
const process = require('child_process');
const { app, BrowserWindow, Menu } = require('electron');

let mongo, server, win;

function log(data) {
    fs.writeFileSync('logs.txt', data, { flag: 'a' });
    fs.writeFileSync('logs.txt', '\n', { flag: 'a' });
}

function startMongoDB(root) {
    mongo = process.exec(`${root}\\mongo\\mongod.exe --dbpath=${root}\\mongo\\db`, {
        cwd: `${root}\\mongo`,
        encoding: 'gbk' // only for Chinese
    });
    mongo.stdout.on('data', data => {
        log(`Mongo Out: ${data}`);
    });
    mongo.stderr.on('data', data => {
        log(`Mongo Error: ${data}`);
    });
    mongo.on('SIGTERM', data => {
        mongo.exit(0);
        log(`Mongo Close: ${data}`);
    });
}

function startServer(root) {
    server = process.exec(`${root}\\build\\ShadowEditor.exe serve --config ./config.toml`, {
        cwd: `${root}\\build`,
        encoding: 'gbk' // only for Chinese
    });
    server.stdout.on('data', data => {
        log(`Server Out: ${data}`);
    });
    server.stderr.on('data', data => {
        log(`Server Error: ${data}`);
    });
    server.on('SIGTERM', data => {
        server.exit(0);
        log(`Server Close: ${data}`);
    });
}

function start() {
    const path = app.getAppPath();

    startMongoDB(path);
    startServer(path);

    Menu.setApplicationMenu(null);
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // win.maximize();
    win.loadURL('http://localhost:2020');
    win.on('close', () => {
        if (mongo) {
            mongo.kill('SIGTERM');
        }
        if (server) {
            server.kill('SIGTERM');
        }
    });
}

app.whenReady().then(start);