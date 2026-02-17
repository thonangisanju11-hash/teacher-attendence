const firebaseConfig = {
  apiKey: "AIzaSyA1B2C3D4",
  authDomain: "teacher-attendance.firebaseapp.com",
  projectId: "teacher-attendance",
  storageBucket: "teacher-attendance.appspot.com",
  messagingSenderId: "987654321",
  appId: "1:987654321:web:abcd1234"
};
const firebaseConfig = {
  apiKey: "PASTE_FROM_FIREBASE",
  authDomain: "PASTE_FROM_FIREBASE",
  projectId: "PASTE_FROM_FIREBASE",
  storageBucket: "PASTE_FROM_FIREBASE",
  messagingSenderId: "PASTE_FROM_FIREBASE",
  appId: "PASTE_FROM_FIREBASE"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
