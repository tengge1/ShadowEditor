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

1. tensorflow/basic/hello_world.py：Hello World示例
2. tensorflow/basic/calculate.py: 加减乘除运算
3. tensorflow/basic/calculate_matrix.py: 矩阵运算
3. tensorflow/basic/mnist_beginer.py: 初学者手写数字识别，准确度:96.3%
4. tensorflow/basic/mnist_expert.py: 专家级手写数字识别，准确度：98.112%
5. tensorflow/basic/image_classification.py: 服装图片分类，准确度：87.81%
6. tensorflow/basic/basic_text_classification.py: 评论文本分类，准确度：86.2%
7. tensorflow/basic/feature_columns.py: 对结构化数据进行分类，准确度：72.54%
8. tensorflow/basic/basic_regression.py: 线性回归
9. tensorflow/basic/overfit_and_underfit.py: 过拟合和欠拟合，准确度：99.99%
10. tensorflow/basic/save_and_restore_models.py: 保存和恢复模型

## 相关地址

* 官网: https://pypi.org/project/tensorflow/#history
* 最新版本: https://pypi.org/project/tensorflow-gpu/#history