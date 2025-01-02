import keras
import numpy as np
import matplotlib.pyplot as plt
import numpy as np
from keras.models import load_model
import requests
import requests # request img from web
import shutil # save img locally
# importing modules
import requests
import numpy as np
from flask import  jsonify, request
 
 

# load model
# model = load_model('Project.h5')
# model.summary()
# model.load('Project.h5')
# model.load_weights('Project_weights.h5')


# Classes = ["10 PKR", "20 PKR", "50 PKR",
#            "100 PKR", "500 PKR", "1000 PKR", "5000 PKR"]

# Pre-Processing test data same as train data.
img_width = 256
img_height = 256
# model.compile(optimizer='adam',loss='categorical_crossentropy',metrics=['accuracy'])


def prepare(img_path):
    img = keras.utils.load_img(img_path, target_size=(256, 256)) # type: ignore
    x = keras.utils.img_to_array(img) # type: ignore
    x = x/255
    return np.expand_dims(x, axis=0)


def predict(url):
    model = load_model('Project.h5')
    
    Classes = ['10', '100', '1000', '20', '50' , '500', '5000']
    # Classes = ["10 PKR","100 PKR","1000 PKR","20 PKR","50 PKR" ,"500 PKR","5000 PKR"]
    # urllib.request.urlretrieve(
    #     url,
    #     "currencyTesting.jpg")
    res = requests.get(url, stream = True)

    if res.status_code == 200:
        with open("currencyTesting.jpg",'wb') as f:
            shutil.copyfileobj(res.raw, f)
        print('Image sucessfully Downloaded: ',"currencyTesting.jpg")
    else:
        print('Image Couldn\'t be retrieved')
    result = model.predict([prepare('currencyTesting.jpg')])
    print(result)
    print(np.argmax(result))
    
    Pound = keras.utils.load_img('currencyTesting.jpg') # type: ignore
    plt.imshow(Pound)
    if((float)(np.max(result))>0.966):
        return (Classes[np.argmax(result)])
    else:
        return ("Please provide clear image ")










 
 

 





