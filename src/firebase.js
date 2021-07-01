import firebase from "firebase"
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARXZU-V_R8D7iALu4u74y-SvnMDf29apc",
  authDomain: "instagram-clone-final-9d960.firebaseapp.com",
  projectId: "instagram-clone-final-9d960",
  storageBucket: "instagram-clone-final-9d960.appspot.com",
  messagingSenderId: "927529882156",
  appId: "1:927529882156:web:71c00102f14914b3f63789",
  measurementId: "G-J4W7P9HH8Y"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const database = firebaseApp.firestore()
const storage = firebase.storage()

export { auth, database, storage }