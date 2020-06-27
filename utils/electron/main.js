const fs = require('fs');
const path = require('path');
const os = require('os');
const subprocess = require('child_process');
const { app, BrowserWindow, Menu } = require('electron');

let mongo, server, win;

/**
 * Write logs to the log file.
 * @param {String} data message
 */
function log(data) {
    fs.writeFileSync('logs.txt', data.toString().trim('\n') + '\n', { flag: 'a' });
}

/**
 * Start MongoDB Service
 * @param {String} root electron root path
 */
function startMongoDB(root) {
    const mongod = os.platform() === 'win32' ? 'mongod.exe' : './mongod';
    const cwd = path.join(root, 'mongo');

    if (os.platform() !== 'win32') {
        // ubuntu desktop need libcurl4
        process.env.LD_LIBRARY_PATH = `LD_LIBRARY_PATH:${cwd}`
    }

    mongo = subprocess.spawn(mongod, ['--dbpath=db'], {
        cwd: cwd
    });
    mongo.stdout.on('data', data => {
        log(data.toString());
    });
    mongo.stderr.on('data', data => {
        log(data.toString());
    });
    mongo.on('SIGTERM', () => {
        mongo.exit(0);
        log('mongodb close');
    });
}

/**
 * Start ShadowEditor server
 * @param {String} root electron root path
 */
function startServer(root) {
    const shadoweditor = os.platform() === 'win32' ? 'ShadowEditor.exe' : './ShadowEditor';
    server = subprocess.spawn(shadoweditor, ['serve', '--config', './config.toml'], {
        cwd: root
    });
    server.stdout.on('data', data => {
        log(data.toString());
    });
    server.stderr.on('data', data => {
        log(data.toString());
    });
    server.on('SIGTERM', data => {
        server.exit(0);
        log('shadow editor close');
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