import tensorflow as tf

a = tf.constant(1)
b = tf.constant(2)
c = tf.constant(3)
d = tf.constant(3)


@tf.function
def calculate():
    return ((a + b) * c)**3


result = calculate()
print(result.numpy())
