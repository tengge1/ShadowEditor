# https://keras.io/getting-started/sequential-model-guide/
# Multilayer Perceptron (MLP) for multi-class softmax classification
# 用于多层softmax分类的多层感知器（MLP）

import numpy as np
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Activation
from tensorflow.keras.optimizers import SGD

x_train = np.random.random((1000, 20))
y_train = keras.utils.to_categorical(
    np.random.randint(10, size=(1000, 1)),
    num_classes=10
)
x_test = np.random.random((100, 20))
y_test = keras.utils.to_categorical(
    np.random.randint(10, size=(100, 1)),
    num_classes=10
)

model = Sequential()
model.add(Dense(64, activation='relu', input_dim=20))
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(10, activation='softmax'))

sgd = SGD(
    lr=0.01,
    decay=1e-6,
    momentum=0.9,
    nesterov=True
)

model.compile(
    loss='categorical_crossentropy',
    optimizer=sgd,
    metrics=['accuracy']
)

model.fit(
    x_train,
    y_train,
    epochs=20,
    batch_size=128
)

score = model.evaluate(x_test, y_test, batch_size=128)
