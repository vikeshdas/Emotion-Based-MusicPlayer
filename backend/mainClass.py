"""
    model loads the trained model and detects the emotion of the user's face. selects a random mp3 file from the detected imotion folder on the disc and converts mp3 files to bytes.
"""

import os
import base64
import cv2
import numpy as np
import random
from tensorflow.keras.preprocessing.image import img_to_array
from keras.models import load_model
  
class read_frames:
    """
        load the trained model from disk to predict the emotion,load the harcascade classifier to crop the image.
    """
    def __init__(self):
        self.face_classifier = cv2.CascadeClassifier(r'../haarcascade_frontalface_default.xml')
        self.classifier =load_model(r'../model/model.h5')
        self.emotion_labels = ['Angry','Disgust','Fear','Happy','Neutral', 'Sad', 'Surprise']

    def emotion(self, json_data):
        """
            detects the emotion on the list of the frame, stores the frequency of each imotion whichever emotion have a maximum number of the frame that will be output ,select the radom music from 'output' music list convert mp3 file to bytes object and send to the front end

            Args:
                 list of frame in bytes form

            Returns:
                song in bytes form

        """

        #frequency of each emotion during recording
        # frame_frequency = {'Angry':0,'Disgust':0,'Fear':0,'Happy':0,'Neutral':0,'Sad':0,'Surprise':0}


        # frame_faces = []
        # for i in range(250):
        #     img = base64.b64decode(json_data[i])
        #     npimg = np.frombuffer(img, dtype=np.uint8)
        #     frame = cv2.imdecode(npimg, 1)
        #     labels = []
            
        #     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        #     faces = self.face_classifier.detectMultiScale(gray)

        #     for (x,y,w,h) in faces:
        #         cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,255),2)
        #         roi_gray = gray[y:y+h,x:x+w]
        #         roi_gray = cv2.resize(roi_gray,(48,48),interpolation=cv2.INTER_AREA)
                
        #         if np.sum([roi_gray])!=0:
        #             roi = roi_gray.astype('float')/255.0
        #             roi = img_to_array(roi)
        #             frame_faces.append(roi)


        # frame_faces=np.array(frame_faces)
        # print("before prediction")
        # prediction = self.classifier.predict(frame_faces)
        # print("after prediction")
        # label=""

        # for i in range(np.size(prediction, 0)):
        #     label=self.emotion_labels[prediction[i].argmax()]
        #     frame_frequency[label]+=1   
         
        # maxfrequency = max(zip(frame_frequency.values(), frame_frequency.keys()))[1]
        maxfrequency = 5
        # music=random.choice(os.listdir('../dataset/songs/' + maxfrequency))
        # music='../dataset/songs/'+maxfrequency+'/'+music
        # print(music)
        filename = "../dataset/song.mp3"
        print(filename)

        # with open(music, 'rb') as fd:
        #     contents = fd.read()
        with open(filename, 'rb') as fd:
            contents = fd.read()

        return contents, maxfrequency
    