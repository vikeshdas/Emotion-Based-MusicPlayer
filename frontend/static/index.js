
/**
method of this mode open the web camera and record the video extract the frame of video and send list of frame to backend for emotion detection
*/

var startbutton;
let close_camera;
var stream;


class Readface {
    constructor() {
        this.width = 320; 
        this.height = 0; 
        this.streaming = false;
        this.video = null;
        this.canvas = null;
        this.photo = null;
        
        this.output=null;
        this.tracks=null;
        this.stopcmr=true;
    }
}


/**
method  start the web camera and desplay live vedeo on front end 
*/
function startup() { 

    obj.stopcmr=false;
    obj.width = 320;
    obj.height = 0; 
    obj.streaming = false;
    obj.video = null;
    obj.canvas = null;
    obj.photo = null;
    startbutton = null;
    obj.output=null;
    obj.tracks=null;

    obj.video = document.getElementById('video');
    obj.canvas = document.getElementById('canvas');
    obj.photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');
    navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })
        .then(function(stream) {
            obj.video.srcObject = stream;
            obj.video.play();
            obj.tracks = stream.getTracks();
        })
        .catch(function(err) {
            console.log("An error occurred: " + err);
        });

    obj.video.addEventListener('canplay', function(ev) {
        if (!obj.streaming) {
            obj.height = obj.video.videoHeight / (obj.video.videoWidth / obj.width);

            if (isNaN(obj.height)) {
                obj.height = obj.width / (4 / 3);
            }
                         
            obj.video.setAttribute('width', obj.width);
            obj.video.setAttribute('height',obj.height);
            obj.canvas.setAttribute('width',obj.width);
            obj.canvas.setAttribute('height',obj.height);
            obj.streaming = true;
        }
    }, false);

}

/**
 * method extract the first 250 frames from live video and stores frames in a array
*/
function makeframe()
{
    if(obj.stopcmr===true)
    {
        window.alert("camera is off");
        return;
    }
    let frame=[];
    for(let i=0;i<250;i++)
    {
        var f=takepicture();
        frame.push(f);
    }
    document.getElementById("reading_complete").innerHTML="Face Reading Complete";

    document.getElementsByClassName("loader")[0].style.display = "block";
    makerequest(frame);
    
}

/**
method  hit the backend flask API with list of frames for emotion detection
*/
function makerequest(frame)
{
    var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", 'http://127.0.0.1:8000/camera', true);
        xmlHttp.onprogress = function () {
        }
        xmlHttp.onload = function () {
            var res = this.responseText;document.getElementsByClassName("reading_complete").innerHTML=''
            res=JSON.parse(res);
            var emotion=res.emotion;
            var myBuffer=res.music;
            myBuffer = base64DecToArr(myBuffer).buffer;
            var blob = new Blob([myBuffer], { type: 'audio/mp3' });
            var url = window.URL.createObjectURL(blob);
            var song = document.getElementById("audio")
            song.src = url;
            document.getElementById("emotion").innerHTML = emotion+' song';
            document.getElementsByClassName("loader")[0].style.display = "none";
            document.getElementById("reading_complete").innerHTML='';
        }
        xmlHttp.send(JSON.stringify(frame));  
           

}

/**
method  extract one frame from live video 
*/
function takepicture() {
    var context = obj.canvas.getContext('2d');
    if (obj.width && obj.height) {
        obj.canvas.width = obj.width;
        canvas.height =obj.height;
        context.drawImage(obj.video, 0, 0, obj.width, obj.height);

        var data = obj.canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");
    } 
    return data;
}

/**
 * method stop the camera if it is onn
*/
function stop_camera()
{
    obj.tracks[0].stop();
    obj.stopcmr=true;
}

let obj = new Readface();
window.addEventListener('load', (event) => {
    stream = document.getElementById("stream");
    stream.addEventListener("click", startup);


    startbutton=document.getElementById("startbutton");
    startbutton.addEventListener("click",makeframe)

    close_camera=document.getElementById("stop");
    close_camera.addEventListener('click',stop_camera)
});








