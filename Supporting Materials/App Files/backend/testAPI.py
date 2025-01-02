import json

from objectHelp import *
from colorHelp import *
from currencyHelp import *
from collections.abc import MutableMapping



app = Flask(__name__)


@app.route('/object_detection')
def with_parameters_object_detection():
    url = request.args.get('url')
    imgN = url.translate({ord(i): None for i in '_\\.-:=/?'})
    localImage = "objDetection.jpg"
    localImage = append_timestamp(localImage)
    result = requests.get(url, stream=True)  # type: ignore
    if result.status_code == 200:
        with open(localImage, 'wb') as f:
            shutil.copyfileobj(result.raw, f)
        print('Image sucessfully Downloaded: ', localImage)
    else:
        print("Image Couldn't be retrieved")
    res = objectDetectionMain(imgN, localImageName=localImage)
    os.remove(localImage)
    os.remove('object_detection.jpg')
    return jsonify(url=res, Objtects=[*set(detectetObjects)])


@app.route('/location', methods=['GET'])
def with_parameters_location():
    config = {
    'apiKey': "AIzaSyAcdoCcjf8q5BwIqePpoNSsyTaBMDgNn3M",
    'authDomain': "blindy-278b9.firebaseapp.com",
    'databaseURL': "https://blindy-278b9-default-rtdb.firebaseio.com",
    'projectId': "blindy-278b9",
    'storageBucket': "blindy-278b9.appspot.com",
    'messagingSenderId': "967103279796",
    'appId': "1:967103279796:web:d938ac60c3075e03085de1",
    'measurementId': "G-3198C1MZ2D"
    }
    firebase = pyrebase.initialize_app(config)

    # Get a reference to the database service
    db = firebase.database()

    # Get all data from the root of the database
    data = db.get().val()
    json_data = json.dumps(data)
    # Print the data
    print(json_data)
    return (
        json_data
    )


@app.route('/color_detection', methods=['GET'])
def with_parameters_color_Detection():
    url = request.args.get('url')
    height = float(request.args.get('height'))
    width = float(request.args.get('width'))
    x = float(request.args.get('x'))  # type: ignore
    y = float(request.args.get('y'))  # type: ignore
    height = int(height)  # type: ignore
    width = int(width)  # type: ignore
    res = requests.get(url, stream=True)  # type: ignore
    print()
    if res.status_code == 200:
        with open(img_path, 'wb') as f:
            shutil.copyfileobj(res.raw, f)
        print('Image sucessfully Downloaded: ', "currencyTesting.jpg")
    else:
        print('Image Couldn\'t be retrieved')
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
        colorName, r, g, b = (draw_function(int(x), int(y), img))
        return jsonify(
            Result={
                'status': 200,
                'Color': colorName,
                'R': r,
                'G': g,
                'B': b,
            }
        )


@app.route('/currency_detection', methods=['GET'])
def with_parameters_currency_detection():
    url = request.args.get('url')
    prediction = predict(url)
    return jsonify(result=prediction)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
