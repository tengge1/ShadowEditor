const fs = require('fs');
const path = require('path');
const subprocess = require('child_process');
const { app, BrowserWindow, Menu } = require('electron');

let mongo, server, win;

function log(data) {
    fs.writeFileSync('logs.txt', data, { flag: 'a' });
    fs.writeFileSync('logs.txt', '\n', { flag: 'a' });
}

function startMongoDB(root) {
    process.chdir(path.join(root, 'mongo'));

    mongo = subprocess.spawn('mongod.exe', ['--dbpath=db']);
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
    process.chdir(root);

    server = subprocess.spawn(`ShadowEditor.exe `, ['serve', '--config', './config.toml']);
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
    const root = app.getAppPath();

    startMongoDB(root);
    startServer(root);

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