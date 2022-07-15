"""
    Flask API to  detect the emotion and fetch music from the disc according to the emotion of the user 
"""
import random
import os
import flask
from flask import Flask
from flask_cors import CORS
from flask import request, Flask
import base64
from flask_cors import CORS


app = Flask(__name__)

CORS(app)
cors = CORS(app, resources={r"*": {"origins": "*"}})





@app.route("/camera", methods=["POST","GET"])
def camera():
    """
        flask api to  select music form emotion's and read bytes from files send back to front end 
        
        Return:  
             song in bytes form
    """
    emotion =request.data
    emotion=emotion.decode("utf-8")
    music=random.choice(os.listdir('../dataset/songs/' + emotion))
    music='../dataset/songs/'+emotion+'/'+music

    with open(music, 'rb') as fd:
        contents = fd.read()
    music=contents
    music = base64.b64encode(music)
    headers = {
        "content_length" : len(music)
    }
    return flask.Response(music, headers=headers)



if __name__ == '__main__':
    app.run(debug=True,port="8000")
