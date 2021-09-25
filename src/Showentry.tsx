import React  from "react";
import { Alert } from "react-bootstrap";
import apiData from "./apiKey";
import 'firebase/auth'
import 'firebase/app'
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: apiData.apiKey,
    authDomain: apiData.authDomain,
    projectId: apiData.projectId,
    storageBucket: apiData.storageBucket,
    messagingSenderId: apiData.messagingSenderId,
    appId: apiData.appId,
    measurementId: apiData.measurementId
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore();
  const analytics = getAnalytics(app);


// test only query;

function Entries(){
    // test only
    async function fetchAllEntry(){
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        });
    }
    fetchAllEntry();
 
    return (
        <div>
            <h1>💁‍今までの気持ち💁‍</h1>
            {
            }
        </div>
    )
}

export default Entries;