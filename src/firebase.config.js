import {getApp, getApps, initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'


const firebaseConfig = {

    apiKey: "AIzaSyCN5x9lklzY0EIXS4f4rlUGS0VJlRZEIFg",
  
    authDomain: "restaurantapp-1e5c0.firebaseapp.com",
  
    databaseURL: "https://restaurantapp-1e5c0-default-rtdb.firebaseio.com",
  
    projectId: "restaurantapp-1e5c0",
  
    storageBucket: "restaurantapp-1e5c0.firebasestorage.app",
  
    messagingSenderId: "394608578051",
  
    appId: "1:394608578051:web:6dc11c23f0a883f0f7c836"
  
  };

const app = getApps.Length > 0 ? getApp() : initializeApp(firebaseConfig);

const firestore = getFirestore(app)
const storage = getStorage(app)

export {app, firestore, storage};  