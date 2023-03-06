import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnG_yT0-nYDqevTZU3M6OAyf_C5wQlYqc",
  authDomain: "energy-meter-e0129.firebaseapp.com",
  projectId: "energy-meter-e0129",
  storageBucket: "energy-meter-e0129.appspot.com",
  messagingSenderId: "786113299073",
  appId: "1:786113299073:web:7f90e5bf9ba191d6bcc380",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

var email = document.getElementById("email");
var password = document.getElementById("pass");

const signin = document.getElementById("signin");
const signout = document.getElementById("signout");
var email1;

signin.onclick = () => {
  signin();
};

function signin() {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = auth.currentUser;

      localStorage.setItem("email", email.value);

      email1 = localStorage.getItem("email");
      console.log(email1);

      alert("Signed in Successfully");

      location.href = "success.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error " + error.code);
    });
}

signout.onclick = () => {
  signout();
};

function singout() {
  alert("Refreshing");
  location.reload();
}
