import tensorflow as tf


@tf.function
def add(a, b):
    return a + b


result = add(4, 5)

tf.print(result)
