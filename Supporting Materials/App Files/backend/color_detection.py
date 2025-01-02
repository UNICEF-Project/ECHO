import cv2
from flask import Flask, jsonify, request
import numpy as np
import pandas as pd
import argparse
import keras
import numpy as np
import matplotlib.pyplot as plt
import numpy as np
from keras.models import load_model
from PIL import Image
import requests
from io import BytesIO
import requests  # request img from web
import shutil  # save img locally
# importing modules
import urllib.request
from PIL import Image
import requests
from flask import Flask


from keras.preprocessing import image


from flask import Flask, request, Response
import jsonpickle
import numpy as np
import cv2

from flask import Flask, jsonify, request
# Creating argument parser to take image path from command line


# import urllib.request
# # MyUrl = input(": ") #Your url goes here
# # urllib.request.urlretrieve(MyUrl,'colorTesting.jpg')

# img_path = 'colorTesting.jpg'

# #Reading the image with opencv
# img = cv2.imread(img_path)

# #declaring global variables (are used later on)

# #Reading csv file with pandas and giving names to each column
# index=["color","color_name","hex","R","G","B"]
# csv = pd.read_csv('colors.csv', names=index, header=None)

# #function to calculate minimum distance from all colors and get the most matching color
# def getColorName(R,G,B):
#     minimum = 10000
#     for i in range(len(csv)):
#         d = abs(R- int(csv.loc[i,"R"])) + abs(G- int(csv.loc[i,"G"]))+ abs(B- int(csv.loc[i,"B"]))
#         if(d<=minimum):
#             minimum = d
#             cname = csv.loc[i,"color_name"]
#     return cname

# #function to get x,y coordinates of mouse double click
# def draw_function( x,y):
#         print('x : ',x , '   y : ',y)
#     # if event == cv2.EVENT_LBUTTONDBLCLK:
#         if(x>=img.shape[0] or y>=img.shape[1]):
#             return ("Index out of bound")
#         else :
#             global b,g,r,xpos,ypos, clicked
#             clicked = True
#             xpos = x
#             ypos = y
#             b,g,r = img[x,y]
#             b = int(b)
#             g = int(g)
#             r = int(r)
#             print(getColorName(r,g,b) + ' R='+ str(r) +  ' G='+ str(g) +  ' B='+ str(b))
#             return(getColorName(r,g,b) + ' R='+ str(r) +  ' G='+ str(g) +  ' B='+ str(b))

img_path = 'colorTesting.jpg'
csv_path = 'colors.csv'

# reading csv file
index = ['color', 'color_name', 'hex', 'R', 'G', 'B']
df = pd.read_csv(csv_path, names=index, header=None)

# reading image
img = None
img = None

# declaring global variables
clicked = False
r = g = b = xpos = ypos = None

# function to calculate minimum distance from all colors and get the most matching color


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
    # if event == cv2.EVENT_LBUTTONDBLCLK:
    # if (x >= img.shape[1] or y >= img.shape[0]):
    #     return ("Index out of bound")
    # else:
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


app = Flask(__name__)


@app.route('/color_detection', methods=['GET'])
def with_parameters():
    url = request.args.get('url')
    x = float(request.args.get('x'))
    y = float(request.args.get('y'))
    height = (request.args.get('height'))
    width = (request.args.get('width'))
    height = int(float(height))
    width = int(float(width))
    res = requests.get(url, stream=True)

    if res.status_code == 200:
        with open(img_path, 'wb') as f:
            shutil.copyfileobj(res.raw, f)
        print('Image sucessfully Downloaded: ', "currencyTesting.jpg")
    else:
        print('Image Couldn\'t be retrieved')
    global img
    img = cv2.imread(img_path)
    dim = (width, height)
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


if __name__ == '__main__':
    app.run()
