import tensorflow as tf

W = tf.Variable(tf.ones(shape=(2,2)), name="W")
b = tf.Variable(tf.zeros(shape=(2)), name="b")

@tf.function
def forward(x):
    return W * x + b

out_a = forward([1,0])
print(out_a)