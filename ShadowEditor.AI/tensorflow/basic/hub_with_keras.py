from __future__ import absolute_import, division, print_function, unicode_literals

import matplotlib.pylab as plt

import tensorflow as tf

import tensorflow_hub as hub

from tensorflow.keras import layers

classifier_url ="https://hub.tensorflow.google.cn/google/tf2-preview/mobilenet_v2/classification/2" #@param {type:"string"}

IMAGE_SHAPE = (224, 224)

classifier = tf.keras.Sequential([
    hub.KerasLayer(classifier_url, input_shape=IMAGE_SHAPE+(3,))
])

import numpy as np
import PIL.Image as Image

grace_hopper = tf.keras.utils.get_file('image.jpg','https://storage.googleapis.com/download.tensorflow.org/example_images/grace_hopper.jpg')
grace_hopper = Image.open(grace_hopper).resize(IMAGE_SHAPE)

grace_hopper = np.array(grace_hopper)/255.0

result = classifier.predict(grace_hopper[np.newaxis, ...])

predicted_class = np.argmax(result[0], axis=-1)

labels_path = tf.keras.utils.get_file('ImageNetLabels.txt','https://storage.googleapis.com/download.tensorflow.org/data/ImageNetLabels.txt')
imagenet_labels = np.array(open(labels_path).read().splitlines())

plt.imshow(grace_hopper)
plt.axis('off')
predicted_class_name = imagenet_labels[predicted_class]
_ = plt.title("Prediction: " + predicted_class_name.title())

# data_root = tf.keras.utils.get_file(
#   'flower_photos','https://storage.googleapis.com/download.tensorflow.org/example_images/flower_photos.tgz',
#    untar=True)

# image_generator = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1/255)
# image_data = image_generator.flow_from_directory(str(data_root), target_size=IMAGE_SHAPE)

# for image_batch, label_batch in image_data:
#   print("Image batch shape: ", image_batch.shape)
#   print("Label batch shape: ", label_batch.shape)
#   break

# result_batch = classifier.predict(image_batch)

