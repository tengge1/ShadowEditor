import tensorflow as tf

a = tf.constant(1)
b = tf.constant(2)
c = tf.constant(3)


@tf.function
def calculate():
    return (a + b) * c


result = calculate()
print(result)
