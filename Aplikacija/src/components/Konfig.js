import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyCOCvD5mk9iOOdrNgFZUm4Sr23FuehBD00",
  authDomain: "gunshop-9c4ec.firebaseapp.com",
  databaseURL: "https://gunshop-9c4ec.firebaseio.com",
  projectId: "gunshop-9c4ec",
  storageBucket: "gunshop-9c4ec.appspot.com",
  messagingSenderId: "252678843307",
  appId: "1:252678843307:web:20333a6ad1d361e58f80ee",
  measurementId: "G-MGGV3E37QG",
};

var fire = firebase.initializeApp(firebaseConfig);

fire
  .messaging()
  .usePublicVapidKey(
    "BEsjDMww2wZIVCdPUOXHnBZZZYO-GE8pHbSKVU5FShoqTCB8m6C2jpZ0zUHE_9CQBT835ezkt4XTE6JwpQZMlyk"
  );

export default fire;
