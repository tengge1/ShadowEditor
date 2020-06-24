const express = require('../node_modules/express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, world.');
});

const server = app.listen(3000, () => {
    console.log('server is ready');
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('server terminated');
    });
});

process.kill(process.pid, 'SIGTERM');