"""
    Flask API to  detect the emotion and fetch music from the disc according to the emotion of the user 
"""
import base64
from flask import Flask,render_template
from flask_cors import CORS
from mainClass import read_frames
from flask import request, Flask,json
import base64
import numpy as np
from flask_cors import CORS
from json import JSONEncoder
import numpy
import json

app = Flask(__name__)

CORS(app)
cors = CORS(app, resources={r"*": {"origins": "*"}})



class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, numpy.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)



@app.route("/camera", methods=["POST","GET"])
def camera():
    """
        flask api to  detect the emotion of the face from the frames requested by front end and response with emotion text form ,music in bytes form
        
        Return:  
             song in bytes form
    """
    md=read_frames()
    data = request.get_data()
    json_data=[]
    json_data = json.loads(data)
    json_data=np.array(json_data)
    music, emotion = md.emotion(json_data) 
    music = base64.b64encode(music)
    # music=music.decode("utf-8")
    # all_data={'music':music,'emotion':emotion}
    # all_data = json.dumps(all_data, cls=NumpyArrayEncoder)
    print("inside camera")
    return music


if __name__ == '__main__':
    app.run(debug=True,port=8000)
