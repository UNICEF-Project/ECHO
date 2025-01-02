
import cv2
import numpy as np
from flask import Flask, jsonify, request
import requests
import shutil 
import pyrebase
import os
import random
import datetime
import random
import string

# Generate a random string to use as filename
def generate_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

# Append timestamp to filename, including microseconds
def append_timestamp(filename):
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")
    return f"{timestamp}_{filename}"


detectetObjects=[]

fireBaseImageName=None
#firebase coniguration
config ={
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
firebase= pyrebase.initialize_app(config)

def objectDetectionMain(fireBaseImageName,localImageName):
    class args:
        def __init__(self, image, config, weights, classes):
            self.image=image
            self.config=config
            self.weights=weights
            self.classes=classes


    args=args(localImageName,'yolov3.cfg','yolov3.weights','yolov3.txt')


    def get_output_layers(net):
        
        layer_names = net.getLayerNames()
        try:
            output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]
        except:
            output_layers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]

        return output_layers


    def draw_prediction(img, class_id, confidence, x, y, x_plus_w, y_plus_h):

        label = str(classes[class_id])
        detectetObjects.append(label)
        color = COLORS[class_id]
        cv2.rectangle(img, (x,y), (x_plus_w,y_plus_h), color, 20)
        w = x_plus_w - x
        h = y_plus_h - y
        rectangle_width = w
        target_coverage = 0.4
        font_size = int(rectangle_width * target_coverage) / 65
        text_width, text_height = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, font_size, 6)[0]
        cv2.putText(img, label, (x + 10, y + text_height + 10), cv2.FONT_HERSHEY_SIMPLEX, font_size, color,int(font_size))

        
    image = cv2.imread(args.image)

    Width = image.shape[1]
    Height = image.shape[0]
    scale = 0.00392

    classes = None

    with open(args.classes, 'r') as f:
        classes = [line.strip() for line in f.readlines()]

    COLORS = np.random.uniform(0, 130, size=(len(classes), 3))

    net = cv2.dnn.readNet(args.weights, args.config)

    blob = cv2.dnn.blobFromImage(image, scale, (416,416), (0,0,0), True, crop=False)

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


    indices = cv2.dnn.NMSBoxes(boxes, confidences, conf_threshold, nms_threshold)

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
        draw_prediction(image, class_ids[i], confidences[i], round(x), round(y), round(x+w), round(y+h))

    

    cv2.imwrite("object_detection.jpg", image)
    #firebase file upload

    storage = firebase.storage()
    #saving processed file on firebase
    
    storage.child(fireBaseImageName).put("object_detection.jpg")
    #downloading from firebase
    # storage.child(fireBaseImageName).download(filename="fireBimg.jpg",path=os.path.basename(fireBaseImageName))

    #getting url
    url = storage.child(fireBaseImageName).get_url(None)
    
    


    
    return url
    


