import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDTkh9OZx58_Ef18Hg1al8GUplTqsi3SNk',
  authDomain: 'raaschou.firebaseapp.com',
  projectId: 'raaschou',
  storageBucket: 'raaschou.appspot.com',
  messagingSenderId: '327364137474',
  appId: '1:327364137474:web:2b433ec797c44132474d1b',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


import { doc, updateDoc } from "firebase/firestore";

export const updateFirebaseDocument = async (collection, docId, data) => {
  try {
    const docRef = doc(db, collection, docId);
    await updateDoc(docRef, data);
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};