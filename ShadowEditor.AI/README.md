# ShadowEditor.AI

该项目没用，仅供测试。

## 安装GPU版Tensorflow方法

1. 安装Python：python-3.7.4-amd64.exe。

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

## 测试项目

1. tensorflow/hello_world.py：Hello World示例
2. tensorflow/calculate.py: 加减乘除运算
3. tensorflow/calculate_matrix.py: 矩阵运算
2. tensorflow/mnist_beginer.py: 初学者手写数字识别，准确度:96.3%
3. tensorflow/mnist_expert.py: 专家级手写数字识别，准确度：98.112%

## 相关地址

* 官网: https://pypi.org/project/tensorflow/#history
* 最新版本: https://pypi.org/project/tensorflow-gpu/#history