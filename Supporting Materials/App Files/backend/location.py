
from flask import Flask, jsonify
import pyrebase
import json
from collections import OrderedDict
# config = {
#     'apiKey': "AIzaSyAx_s_ZQ7QRh6DdfbEwSfWa0WytmJ4z1sQ",
#     'authDomain': "testing-82f97.firebaseapp.com",
#     'databaseURL': "https://testing-82f97-default-rtdb.asia-southeast1.firebasedatabase.app/location",
#     'projectId': "testing-82f97",
#     'storageBucket': "testing-82f97.appspot.com",
#     'messagingSenderId': "601962728120",
#     'appId': "1:601962728120:web:e06c3321e221eb62eb424d",
#     'measurementId': "G-WSKPT6LX6W"
# }
# # -----------------save data------------------
# firebase=pyrebase.initialize_app(config)
# database=firebase.database()
# data={
#     "longitude":16.6564,
#     "latitude":68.6516,
# }

# database.push(data)


# # -------------------retrive all data--------------------
# firebase = pyrebase.initialize_app(config)

# # Get a reference to the database service
# db = firebase.database()

# # Get all data from the root of the database
# data = db.get().val()
# json_data = json.dumps(data)
# # Print the data
# print(json_data)


app = Flask(__name__)


@app.route('/location', methods=['GET'])
def with_parameters():
    config = {
        'apiKey': "AIzaSyAx_s_ZQ7QRh6DdfbEwSfWa0WytmJ4z1sQ",
        'authDomain': "testing-82f97.firebaseapp.com",
        'databaseURL': "https://testing-82f97-default-rtdb.asia-southeast1.firebasedatabase.app/location",
        'projectId': "testing-82f97",
        'storageBucket': "testing-82f97.appspot.com",
        'messagingSenderId': "601962728120",
        'appId': "1:601962728120:web:e06c3321e221eb62eb424d",
        'measurementId': "G-WSKPT6LX6W"
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


if __name__ == '__main__':
    app.run()

# -------------------retrive latest record---------------------
# firebase = pyrebase.initialize_app(config)
# database = firebase.database()

# # Get the latest record from the 'loc1' node
# latest_record = database.child('loc1').order_by_child('timestamp').limit_to_last(10).get()

# # Print the latest record
# print(latest_record.val())
