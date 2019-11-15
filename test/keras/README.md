# Keras学习

## 数据集

**boston_housing - 波士顿房价回归数据集**

数据集取自卡内基梅隆大学维护的StatLib库。样本包含1970年代后期波士顿郊区不同位置的房屋的13种属性。 目标是某位置房屋的中位数（以k $为单位）。

下载地址：https://storage.googleapis.com/tensorflow/tf-keras-datasets/boston_housing.npz

**cifar10 - 小图像分类**

50,000个32x32彩色训练图像的数据集，被标记为10个类别，以及10,000个测试图像。

下载地址：https://www.cs.toronto.edu/~kriz/cifar-10-python.tar.gz

**cifar100 - 小图像分类**

50,000张32x32彩色训练图像的数据集，超过100个类别的标签和10,000张测试图像。

下载地址：https://www.cs.toronto.edu/~kriz/cifar-100-python.tar.gz

**fashion_mnist - 时尚物品数据库**

包含10个时尚类别的60,000张28x28灰度图像的数据集，以及10,000张图像的测试集。 该数据集可用作MNIST的直接替代。

下载地址：https://storage.googleapis.com/tensorflow/tf-keras-datasets/train-labels-idx1-ubyte.gz  
https://storage.googleapis.com/tensorflow/tf-keras-datasets/train-images-idx3-ubyte.gz.gz  
https://storage.googleapis.com/tensorflow/tf-keras-datasets/t10k-labels-idx1-ubyte.gz  
https://storage.googleapis.com/tensorflow/tf-keras-datasets/t10k-images-idx3-ubyte.gz  

**imdb - IMDB电影评论情感分类**

来自IMDB的25,000条电影评论的数据集，以情感（正/负）标记。

下载地址：https://storage.googleapis.com/tensorflow/tf-keras-datasets/imdb.npz

**mnist - 手写数字数据库**

包含10个数字的60,000张28x28灰度图像的数据集，以及10,000张图像的测试集。

下载地址：https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz

**reuters - 路透社新闻分类**

来自路透社的11,228条新闻专线的数据集，标记了46个主题。

下载地址：https://storage.googleapis.com/tensorflow/tf-keras-datasets/reuters.npz

## 神经网络类型

**Multilayer Perceptron (MLP) - 多层感知器（MLP）**

多层感知机（MLP，Multilayer Perceptron）也叫人工神经网络（ANN，Artificial Neural Network），除了输入输出层，它中间可以有多个隐层，最简单的MLP只含一个隐层，即三层的结构。[CSDN](https://blog.csdn.net/u011734144/article/details/80924207)

**VGG-like convnet - 类似于VGG的卷积网**

VGG模型是2014年ILSVRC竞赛的第二名，第一名是GoogLeNet。但是VGG模型在多个迁移学习任务中的表现要优于googLeNet。而且，从图像中提取CNN特征，VGG模型是首选算法。它的缺点在于，参数量有140M之多，需要更大的存储空间。但是这个模型很有研究价值。[百度百科](https://baike.baidu.com/item/VGG%20%E6%A8%A1%E5%9E%8B/22689655?fr=aladdin)


**LSTM - 长短期记忆网络**

长短期记忆网络（LSTM，Long Short-Term Memory）是一种时间循环神经网络，是为了解决一般的RNN（循环神经网络）存在的长期依赖问题而专门设计出来的，所有的RNN都具有一种重复神经网络模块的链式形式。在标准RNN中，这个重复的结构模块只有一个非常简单的结构，例如一个tanh层。[百度百科](https://baike.baidu.com/item/%E9%95%BF%E7%9F%AD%E6%9C%9F%E8%AE%B0%E5%BF%86%E4%BA%BA%E5%B7%A5%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C/17541107?fromtitle=LSTM&fromid=17541102&fr=aladdin)

