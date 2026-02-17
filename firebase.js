// firebase.js

const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXX",
  authDomain: "teacher-attendance.firebaseapp.com",
  projectId: "teacher-attendance",
  storageBucket: "teacher-attendance.appspot.com",
  messagingSenderId: "987654321",
  appId: "1:987654321:web:abcd1234"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.firestore();

