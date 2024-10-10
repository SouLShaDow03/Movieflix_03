"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = exports.firebaseAuth = void 0;

var _app = require("firebase/app");

var _auth = require("firebase/auth");

var _firestore = require("firebase/firestore");

// Import the functions you need from the SDKs you need
var firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}; // Initialize Firebase

var app = (0, _app.initializeApp)(firebaseConfig);
var firebaseAuth = (0, _auth.getAuth)(app);
exports.firebaseAuth = firebaseAuth;
var db = (0, _firestore.getFirestore)(app);
exports.db = db;