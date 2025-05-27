import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import.meta.env.VITE_APIKEY;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.AUTHDOMAIN,
  projectId: import.meta.env.PROJECTID,
  storageBucket: import.meta.env.STORAGEBUCKET,
  messagingSenderId: import.meta.env.MESSAGINGSENDERID,
  appId: import.meta.env.APPID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
