import datetime
import random
import string
import cv2
from flask import Flask, jsonify, request
import numpy as np
import pandas as pd
import keras
import matplotlib.pyplot as plt
from keras.models import load_model
from PIL import Image
import requests
import shutil
import pyrebase
import os


os.environ["QT_AUTO_SCREEN_SCALE_FACTOR"] = "1"
os.environ["QT_SCREEN_SCALE_FACTORS"] = "1.0"
os.environ["QT_SCALE_FACTOR"] = "1.0"


app = Flask(__name__)

img_path = 'colorTesting.jpg'
csv_path = 'colors.csv'

# reading csv file
index = ['color', 'color_name', 'hex', 'R', 'G', 'B']
df = pd.read_csv(csv_path, names=index, header=None)

r = g = b = xpos = ypos = None


def get_color_name(R, G, B):
    minimum = 1000
    for i in range(len(df)):
        d = abs(R - int(df.loc[i, 'R'])) + abs(G -
                                               int(df.loc[i, 'G'])) + abs(B - int(df.loc[i, 'B']))
        if d <= minimum:
            minimum = d
            cname = df.loc[i, 'color_name']

    return cname

# function to get x,y coordinates of mouse double click


def draw_function(x, y):
    global b, g, r, xpos, ypos, clicked
    clicked = True
    xpos = x
    ypos = y
    b, g, r = img[y, x]
    b = int(b)
    g = int(g)
    r = int(r)
    print("r ", r, "g : ", g, "b ", b)
    print("color name : ", get_color_name(r, g, b))
    return (get_color_name(r, g, b), str(r), str(g), str(b))


@app.route('/color_detection', methods=['GET'])
def with_parameters_color():
    url = request.args.get('url')
    height = (request.args.get('height'))
    width = (request.args.get('width'))
    x = float(request.args.get('x'))
    y = float(request.args.get('y'))
    height = int(height)
    width = int(width)
    res = requests.get(url, stream=True)
    print()
    if res.status_code == 200:
        with open(img_path, 'wb') as f:
            shutil.copyfileobj(res.raw, f)
        print('Image sucessfully Downloaded: ', "currencyTesting.jpg")
    else:
        print('Image Couldn\'t be retrieved')
    global img
    img = cv2.imread(img_path)
    dim = (height, width)
    # resize image
    img = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)

    if (int(x) >= img.shape[1] or int(y) >= img.shape[0]):
        return jsonify(
            Result={
                'status': 400,

            }
        )
    else:
        print(img.shape)
        colorName, r, g, b = (draw_function(int(x), int(y)))
        return jsonify(
            Result={
                'status': 200,
                'Color': colorName,
                'R': r,
                'G': g,
                'B': b,
            }
        )


img_width = 256
img_height = 256


def prepare(img_path):
    img = keras.utils.load_img(img_path, target_size=(256, 256))
    x = keras.utils.img_to_array(img)
    x = x/255
    return np.expand_dims(x, axis=0)


def predict(url):
    model = load_model('currencyDetectionModel.h5')

    Classes = ['10', '100', '1000', '20', '50', '500', '5000']
    res = requests.get(url, stream=True)

    if res.status_code == 200:
        with open("currencyTesting.jpg", 'wb') as f:
            shutil.copyfileobj(res.raw, f)
        print('Image sucessfully Downloaded: ', "currencyTesting.jpg")
    else:
        print('Image Couldn\'t be retrieved')
    result = model.predict([prepare('currencyTesting.jpg')])
    print(result)
    print(np.argmax(result))

    Pound = keras.utils.load_img('currencyTesting.jpg')
    plt.imshow(Pound)
    if ((float)(np.max(result)) > 0.939):
        return (Classes[np.argmax(result)])
    else:
        return ("Please provide clear image ")


@app.route('/currency_detection', methods=['GET'])
def with_parameters_currency():
    url = request.args.get('url')
    prediction = predict(url)
    return jsonify(result=prediction)


# Generate a random string to use as filename
def generate_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

# Append timestamp to filename, including microseconds


def append_timestamp(filename):
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")
    return f"{timestamp}_{filename}"


detectetObjects = []

fireBaseImageName = None
# firebase coniguration
config = {
    "apiKey": "AIzaSyAQ-3ng8cwwqPmLajYEoXsCkqM_oRjoTBo",
    "authDomain": "objectdetection-c8b17.firebaseapp.com",
    "projectId": "objectdetection-c8b17",
    "storageBucket": "objectdetection-c8b17.appspot.com",
    "messagingSenderId": "631823631879",
    "appId": "1:631823631879:web:a6be37c8a1a4afb2e90ca2",
    "measurementId": "G-X6NWCM7QSC",
    "serviceAccount": "serviceAccount.json",
    "databaseURL": "https://objectdetection-c8b17-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
firebase = pyrebase.initialize_app(config)


def objectDetectionMain(fireBaseImageName, localImageName):
    class args:
        def __init__(self, image, config, weights, classes):
            self.image = image
            self.config = config
            self.weights = weights
            self.classes = classes

    args = args(localImageName, 'yolov3.cfg', 'yolov3.weights', 'yolov3.txt')

    def get_output_layers(net):

        layer_names = net.getLayerNames()
        try:
            output_layers = [layer_names[i - 1]
                             for i in net.getUnconnectedOutLayers()]
        except:
            output_layers = [layer_names[i[0] - 1]
                             for i in net.getUnconnectedOutLayers()]

        return output_layers

    def draw_prediction(img, class_id, confidence, x, y, x_plus_w, y_plus_h):

        label = str(classes[class_id])
        detectetObjects.append(label)
        color = COLORS[class_id]
        cv2.rectangle(img, (x, y), (x_plus_w, y_plus_h), color, 2, lineType=1)
        w = x_plus_w - x
        h = y_plus_h - y
        rectangle_width = w
        target_coverage = 0.4
        font_size = int(rectangle_width * target_coverage) / 65
        text_width, text_height = cv2.getTextSize(
            label, cv2.FONT_HERSHEY_TRIPLEX, font_size, 6)[0]
        cv2.putText(img, label, (x + 10, y + text_height + 10),
                    cv2.FONT_HERSHEY_TRIPLEX, font_size, color, int(font_size))

    image = cv2.imread(args.image)

    Width = image.shape[1]
    Height = image.shape[0]
    scale = 0.00392

    classes = None

    with open(args.classes, 'r') as f:
        classes = [line.strip() for line in f.readlines()]

    COLORS = np.random.uniform(0, 130, size=(len(classes), 3))

    net = cv2.dnn.readNet(args.weights, args.config)

    blob = cv2.dnn.blobFromImage(
        image, scale, (416, 416), (0, 0, 0), True, crop=False)

    net.setInput(blob)

    outs = net.forward(get_output_layers(net))

    class_ids = []
    confidences = []
    boxes = []
    conf_threshold = 0.5
    nms_threshold = 0.4

    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > 0.5:
                center_x = int(detection[0] * Width)
                center_y = int(detection[1] * Height)
                w = int(detection[2] * Width)
                h = int(detection[3] * Height)
                x = center_x - w / 2
                y = center_y - h / 2
                class_ids.append(class_id)
                confidences.append(float(confidence))
                boxes.append([x, y, w, h])

    indices = cv2.dnn.NMSBoxes(
        boxes, confidences, conf_threshold, nms_threshold)

    for i in indices:
        try:
            box = boxes[i]
        except:
            i = i[0]
            box = boxes[i]

        x = box[0]
        y = box[1]
        w = box[2]
        h = box[3]
        draw_prediction(image, class_ids[i], confidences[i], round(
            x), round(y), round(x+w), round(y+h))

    cv2.imwrite("object_detection.jpg", image)
    # firebase file upload

    storage = firebase.storage()
    # saving processed file on firebase

    storage.child(fireBaseImageName).put("object_detection.jpg")
    # downloading from firebase
    # storage.child(fireBaseImageName).download(filename="fireBimg.jpg",path=os.path.basename(fireBaseImageName))

    # getting url
    url = storage.child(fireBaseImageName).get_url(None)

    return url


app = Flask(__name__)


@app.route('/object_detection')
def with_parameters_object():
    url = request.args.get('url')
    imgN = url.translate({ord(i): None for i in '_\\.-:=/?'})
    localImage = "objDetection.jpg"
    localImage = append_timestamp(localImage)
    result = requests.get(url, stream=True)
    if result.status_code == 200:
        with open(localImage, 'wb') as f:
            shutil.copyfileobj(result.raw, f)
        print('Image sucessfully Downloaded: ', localImage)
    else:
        print("Image Couldn't be retrieved")
    res = objectDetectionMain(imgN, localImageName=localImage)
    os.remove(localImage)
    os.remove('object_detection.jpg')
    return jsonify(url=res, Objects=[*set(detectetObjects)])


if __name__ == '__main__':
    app.run()
