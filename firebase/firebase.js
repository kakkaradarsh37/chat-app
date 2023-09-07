import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyClaw5rR4qT0VNwwPkUhy0euZ8cM1eeVbE",
  authDomain: "fir-chat-app-14d76.firebaseapp.com",
  projectId: "fir-chat-app-14d76",
  storageBucket: "fir-chat-app-14d76.appspot.com",
  messagingSenderId: "927845649143",
  appId: "1:927845649143:web:dc865df1dd80f478a2a1f2",
  measurementId: "G-657VBDB0VZ"
};


const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth= getAuth(app);
export const storage= getStorage(app);
export const db= getFirestore(app);