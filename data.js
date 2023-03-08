import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");

let database = document.getElementById("database");

const firebaseConfig = {
  databaseURL:
    "https://energy-meter-e0129-default-rtdb.asia-southeast1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase());
const db = getDatabase();

const constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440,
    },
    facingMode: "environment",
  },
};

let image_data_url;
var resp;
var resp1;
var blobData;

camera_button.addEventListener("click", async function () {
  let stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
});

click_button.addEventListener("click", function () {
  document.getElementById("main").style.height = "900px";
  canvas.width = 240;
  canvas.height = 320;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  image_data_url = canvas.toDataURL("image/jpeg");

  // data url of the image
  console.log(image_data_url);
  blobData = createBlob(image_data_url);
  console.log(blobData);
});

function createBlob(dataURL) {
  var BASE64_MARKER = ";base64,";
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(",");
    var contentType = parts[0].split(":")[1];
    var raw = decodeURIComponent(parts[1]);
    return new Blob([raw], { type: contentType });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

$(document).ready(function () {
  $("#submit").click(function (e) {
    e.preventDefault();
    $.ajax({
      url: "https://tarp.cognitiveservices.azure.com/vision/v3.2/read/analyze",
      beforeSend: function (xhrObj) {
        xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
        xhrObj.setRequestHeader(
          "Ocp-Apim-Subscription-Key",
          "7795ca497058453e8d189b31b8e96e3c"
        );
      },
      type: "POST",
      data: blobData,
      processData: false,
    }).done(function (data, textStatus, xhrObj) {
      resp = xhrObj.getResponseHeader("apim-request-id");
      alert("Successfully submitted");
    });
  });

  var myUrl;

  $("#fetch").click(function (e) {
    myUrl =
      "https://tarp.cognitiveservices.azure.com/vision/v3.2/read/analyzeResults/" +
      resp;
    e.preventDefault();
    $.ajax({
      url: myUrl,
      beforeSend: function (xhrObj) {
        //xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
        xhrObj.setRequestHeader(
          "Ocp-Apim-Subscription-Key",
          "7795ca497058453e8d189b31b8e96e3c"
        );
      },
      type: "GET",
    }).done(function (response) {
      resp1 = response;
      console.log(resp1);
      alert(resp1["analyzeResult"]["readResults"][0]);
    });
  });
});

var mail = localStorage.getItem("email");
mail = mail.replace("@gmail.com", "");

database.onclick = () => {
  var dT = new Date().toLocaleString();
  dT = dT.replace("/", "-");
  dT = dT.replace("/", "-");
  set(ref(db, "/" + mail + "/" + dT), {
    readValue: resp1["analyzeResult"]["readResults"][0],
  })
    .then(() => {
      alert("Setted to Database");
    })
    .catch((error) => {
      document.write("<h3>Some Error Occurred</h3>");
    });
};
