@echo off
set current=%~dp0
echo %current%
%current%\instsrv.exe ShadowEditor %current%\srvany.exe
pause