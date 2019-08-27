import tensorflow as tf

text = tf.constant('Hello, world!')


@tf.function
def hello():
    tf.print(text)


hello()
