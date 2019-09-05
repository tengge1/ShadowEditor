# Tensorflow可视化编辑器

## 使用指南

1. 安装Python。

https://www.python.org/downloads/

2. 安装Flask框架。

```
pip install Flask
```

3. 运行程序。

```
python index.py
```

4. 在浏览器中访问。

```
http://localhost:5000/
```

## 正式部署

1. 安装Python3.7.4（64位）。

下载地址：https://www.python.org/downloads/

2. 下载并启动对应版本的Apache。

在控制台输入`Python`，显示：

```
Python 3.7.4 (tags/v3.7.4:e09359112e, Jul  8 2019, 20:34:20) [MSC v.1916 64 bit (AMD64)] on win32
```

`MSC v.1916`对应`Visual Studio 2017(VC15.0)`。

Apache下载地址：https://www.apachehaus.com/cgi-bin/download.plx

下载`Apache 2.4.x OpenSSL 1.1.1 VC15`下面的`Apache 2.4.41 x64`，解压。

打开`Apache24\conf\httpd.conf`文件，搜索`ServerRoot`，换成绝对路径，注意路径要使用`/`分隔符，例如：

```
Define SRVROOT "D:/Program Files/Apache24"
ServerRoot "${SRVROOT}"
```

进入`Apache24\bin`目录，输入`httpd`启动Apache，这时在浏览器输入`http://localhost`应该可以正常访问了。

3. 下载对应版本的`mod_wsgi`并安装。

wsgi下载地址：https://www.lfd.uci.edu/~gohlke/pythonlibs/#mod_wsgi

可以下载对应`Python3.7`和`Visual Studio 2017`的`mod_wsgi‑4.6.7+ap24vc15‑cp37‑cp37m‑win_amd64.whl`文件。

转到文件所在目录，执行以下命令安装模块。

```
pip install "mod_wsgi-4.5.15+ap24vc14-cp36-cp36m-win_amd64.whl
```

安装成功后，在`Python37\Scripts`目录执行`mod_wsgi-express module-config`，得到以下信息。

```
D:\Program Files\Python37\Scripts>mod_wsgi-express module-config
LoadFile "d:/program files/python37/python37.dll"
LoadModule wsgi_module "d:/program files/python37/lib/site-packages/mod_wsgi/server/mod_wsgi.cp37-win_amd64.pyd"
WSGIPythonHome "d:/program files/python37"
```

打开`httpd.conf`文件，搜索`LoadModule`，在最下面添加上面的三行。

重启Apache，不报错证明`mod_wsgi`模块安装成功了。

4. 配置`ShadowEditor.AI`项目。

打开`httpd.conf`，在最后添加以下代码。

```
<VirtualHost *>
    ServerName ShadowEditor.AI
    WSGIScriptAlias / E:\github\ShadowEditor\ShadowEditor.AI\config.wsgi
    <Directory E:\github\ShadowEditor\ShadowEditor.AI\>
        Require all granted
    </Directory>
</VirtualHost>
```

在浏览器中访问`http://localhost/`，将打开`ShadowEditor.AI`首页，部署完成。

## 安装GPU版Tensorflow

GPU版的Tensorflow比CPU版的快接近100倍。下面介绍安装GPU版本Tensorflow的方法。

1. 安装Python：python-3.7.4-amd64.exe。(上面已经安装)

下载地址：https://www.python.org/downloads/release/python-374/

2. 安装CUDA 10.0。

下载地址：https://developer.nvidia.com/cuda-10.0-download-archive

注意：要安装GPU驱动、CUDA工具包、CUDA附带的CUPTI。

3. 安装CUDNN 7.6.2。

下载地址：https://developer.nvidia.com/rdp/cudnn-archive

4. 安装GPU版Tensorflow。

```
pip install tensorflow-gpu==2.0.0-rc0
```

## 参考文档

1. Python中VC编译器对应关系。

```
Visual C++ 2005  (8.0)          MSC_VER=1400
Visual C++ 2008  (9.0)          MSC_VER=1500
Visual C++ 2010 (10.0)          MSC_VER=1600
Visual C++ 2012 (11.0)          MSC_VER=1700
Visual C++ 2013 (12.0)          MSC_VER=1800
Visual C++ 2015 (14.0)          MSC_VER=1900
Visual C++ 2017 (15.0)          MSC_VER=1910
```

2. Windows下部署Flask的Web服务器：https://blog.csdn.net/mist99/article/details/80771289。