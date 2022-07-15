
// /**
// method of this mode open the web camera and record the video extract the frame of video and send list of frame to backend for emotion detection
// */
// var model;
// var predictions;
var face_reading=null;
let close_camera;
let stream=null;
let video=null;
let myinterval=null;
let canvas=null;
let cam=false;

// let backend_ip = "127.0.0.1";
// let backend_port = "8000";

let backend_ip="34.67.74.124";
let backend_port="5000";

async function load_models() {
  faceapi.nets.tinyFaceDetector.loadFromUri("http://127.0.0.1:5000/static/models/"),
    faceapi.nets.faceLandmark68Net.loadFromUri("http://127.0.0.1:5000/static/models/"),
    faceapi.nets.faceRecognitionNet.loadFromUri("http://127.0.0.1:5000/static/models/"),
    faceapi.nets.faceExpressionNet.loadFromUri("http://127.0.0.1:5000/static/models/")
}

// class Readface {
//     constructor() {
//         this.width = 320;
//         this.height = 0;
//         this.streaming = false;
//         this.video = null;
//         this.canvas = null;
//         this.photo = null;

//         this.output = null;
//         this.tracks = null;
//         this.stopcmr = true;
//     }
// }
// let obj = new Readface();






/**
method  hit the backend flask API with list of frames for emotion detection
*/
function makerequest(emotion) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "http://" + backend_ip + ":" + backend_port + "/camera", true);
    xmlHttp.onprogress = function () {
        console.log("waiting...");
    }
    xmlHttp.onload = function () {
        // var myBuffer = this.responseText;
        var myBuffer = base64DecToArr(this.response).buffer;
        var audio = new Blob([myBuffer], { type: 'audio/mp3' });
        console.log(audio);
        var url = window.URL.createObjectURL(audio);
        var song = document.getElementById("audio");
        song.src = url;

        //     res=JSON.parse(res);                       
        // myBuffer = base64DecToArr(res).buffer;
        document.getElementById("emotion").innerHTML = emotion+' song';
        document.getElementsByClassName("loader")[0].style.display = "none";
    }
    xmlHttp.send(emotion);
}




function startVideo() {
  face_reading=null;
  close_camera=null;
  stream=null;
  myinterval=null;
  canvas=null;
  cam=false;
  video = document.getElementById('video');
  cam=true;
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
      tracks = stream.getTracks();
    })
    .catch(function (err) {
      console.log("An error occurred in startVideo: " + err);
    });
    cam=true;
}


function detectemotion() {
  if(cam===false)
  {
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
  canvas = faceapi.createCanvas(video);
  document.body.appendChild (canvas);
  let displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize);
  let detections=null;
  myinterval = setInterval(async function () {
    detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    const obj = resizedDetections[0].expressions;
    let emotion = Object.keys(obj).reduce((i, j) => obj[i] > obj[j] ? i : j);
    frequency_of_emotion[emotion]+=1;
  }, 100);
  setTimeout(function( ) {
     clearInterval( myinterval );
     document.body.removeChild(canvas);
     console.log(frequency_of_emotion);
     let max_frequency = Object.keys(frequency_of_emotion).reduce((i, j) => frequency_of_emotion[i] > frequency_of_emotion[j] ? i : j);
     console.log("final emotion is ",max_frequency);
     makerequest(max_frequency);
     }, 5000);
}

function stop_camera() {
  if(cam===false)
    {
      window.alert("camera is off");
      return;
    }
  cam=false;  
  console.log("inside stop_caimera");
  tracks[0].stop();
}

window.addEventListener('load', (event) => {
  video = document.getElementById('video');
  load_models();

  stream = document.getElementById("stream");
  stream.addEventListener("click", startVideo);

  face_reading = document.getElementById('startbutton');
  face_reading.addEventListener("click", detectemotion);

  close_camera = document.getElementById('stop');
  close_camera.addEventListener('click', stop_camera);
});
