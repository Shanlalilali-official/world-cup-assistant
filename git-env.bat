@echo off
set "ROOT=%~dp0"
set "PATH=%ROOT%.tools\git\cmd;%ROOT%.tools\gh\bin;%PATH%"
echo Project Git environment loaded.
git --version
gh --version
