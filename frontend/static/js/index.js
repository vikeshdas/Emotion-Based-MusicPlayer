
/**
method of this module detect the emotion of the user using web cam and send emotion to the back end for select music 
*/

let backend_ip = "127.0.0.1";
let backend_port = "8000";
let obj;

// let backend_ip="34.171.108.100";
// let backend_port="5000";
async function load_models() {
  obj = new Readface();
  let models = "http://127.0.0.1:5000/static/models/";
  faceapi.nets.tinyFaceDetector.loadFromUri(models),
    faceapi.nets.faceLandmark68Net.loadFromUri(models),
    faceapi.nets.faceRecognitionNet.loadFromUri(models),
    faceapi.nets.faceExpressionNet.loadFromUri(models)
}

class Readface {
    constructor() {
      this.face_reading = null;
      this.close_camera;
      this.stream = null;
      this.video = null;
      this.cam = false;
    }
}


/**
method  hit the backend flask API with emotion as a text detected from the front end using face-API
*/
function makerequest(emotion) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "http://" + backend_ip + ":" + backend_port + "/select_music", true);
  xmlHttp.onprogress = function () {
    console.log("waiting...");
  }
  xmlHttp.onload = function () {
    var myBuffer = base64DecToArr(this.response).buffer;
    var audio = new Blob([myBuffer], { type: 'audio/mp3' });
    var url = window.URL.createObjectURL(audio);
    var song = document.getElementById("audio");
    song.src = url;
    document.getElementById("emotion").innerHTML = emotion + ' song';
  }
  xmlHttp.send(emotion);
}


/**
get user media and start the web cab to record the facial expression of the user
*/
function start_video() {
  if (obj.cam === true) {
    window.alert("camera is onn");
    return;
  }
  obj.cam = false;
  obj.video = document.getElementById('video');
  obj.cam = true;
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  })
    .then(function (stream) {
      obj.video.srcObject = stream;
      obj.video.play();
      tracks = stream.getTracks();
    })
    .catch(function (err) {
      console.log("An error occurred in startVideo: " + err);
    });
  obj.cam = true;
}

/**
method detect the emotion of the user using face API, drow the canvas on the face on the video.
*/
function detectemotion() {
  if (obj.cam === false) {
    window.alert("camera is off");
    return;
  }

  let frequency_of_emotion = {
    neutral: 0,
    happy: 0,
    sad: 0,
    angry: 0,
    fearful: 0,
    surprised: 0,
    disgusted: 0
  };
  let canvas = faceapi.createCanvas(obj.video);
  document.body.appendChild(canvas);
  let displaySize = { width: obj.video.width, height: obj.video.height }
  faceapi.matchDimensions(canvas, displaySize);
  let detections = null;
  let myinterval = setInterval(async function () {
    detections = await faceapi.detectAllFaces(obj.video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    const emotion_obj = resizedDetections[0].expressions;
    let emotion = Object.keys(emotion_obj).reduce((i, j) => emotion_obj[i] > emotion_obj[j] ? i : j);
    frequency_of_emotion[emotion] += 1;
  }, 100);
  setTimeout(function () {
    clearInterval(myinterval);
    document.body.removeChild(canvas);
    let max_frequency = Object.keys(frequency_of_emotion).reduce((i, j) => frequency_of_emotion[i] > frequency_of_emotion[j] ? i : j);
    makerequest(max_frequency);
  }, 5000);
}

/*
stop webcam if it is open 
*/
function stop_camera() {
  if (obj.cam === false) {
    window.alert("camera is off");
    return;
  }
  obj.cam = false;
  tracks[0].stop();
}

window.addEventListener('load', (event) => {
  video = document.getElementById('video');
  load_models();

  obj.stream = document.getElementById("stream");
  obj.stream.addEventListener("click", start_video);

  obj.face_reading = document.getElementById('startbutton');
  obj.face_reading.addEventListener("click", detectemotion);

  obj.close_camera = document.getElementById('stop');
  obj.close_camera.addEventListener('click', stop_camera);
});
