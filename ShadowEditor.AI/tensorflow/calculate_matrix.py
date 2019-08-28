import numpy as np
import tensorflow as tf

W = tf.Variable(tf.ones(shape=(2, 2)), name="W")
b = tf.Variable(tf.zeros(shape=(2)), name="b")

W.assign(np.mat([
    [1, 2],
    [3, 4]
]))

b.assign([
    1, 2
])


@tf.function
def forward(x):
    return W * x + b


result = forward([1, 0])
print(result.numpy())
