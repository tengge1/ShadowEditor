# ShadowEditor Server

This is the server. The main programming language is golang. 

It uses mongodb to store data, and google protocol buffers to
transfer data.

## Structure

| folder | |
| --- | --- |
| cmd | providers shell commands |
| help | helper tools |
| remote | remove editing, useless now |
| server | api controllers |
| test | you can test golang features or packages here |
| three | rewrite three.js math module with golang |
| config.toml | server config |
| config-dev.toml | config file when use vscode to launch server |
| go.mod | go module file |
| go.sum | go third-party packages version |
| main.go | entry point for the server, register sub modules here |
