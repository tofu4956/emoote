import React, { useContext, useEffect, useState }  from "react";
import { Alert } from "react-bootstrap";
import apiData from "./apiKey";
import 'firebase/auth'
import 'firebase/app'
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore, query, where } from "firebase/firestore";
import { collection, addDoc, getDocs} from "firebase/firestore";
import { CredentialContext, CredentialProvider } from "./Authentication";
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

type entry ={
entry: string;
userid: string;
date: string;
}
/*
   class Entry {
entry: string;
userid: any;
date: any;
constructor(entry: string, userid: any, date: any){
this.entry = entry;
this.userid = userid;
this.date = date;
}
callEntryData(){
return this.entry;
}
callUserIdData(){
return this.userid;
}
callDate(){
return this.date;
}
}

//Firestore data Converter

const entryConverter = {
toFirestore: (entry: any) => {
return{
entry: entry.entry,
userid: entry.userid,
date: entry.data
};
},
fromFirestore: (snapshot: any, options: any) => {
const data = snapshot.data(options);
return new Entry(data.entry,data.userid,data.date);
}
};
*/
function Entries(props: any){
  const {currentUser} = useContext(CredentialContext)
    const uid = currentUser !== (null) ? (currentUser !== (undefined) ? currentUser.uid : undefined) : null;
  const [entrylist, setEntrylist] = useState<any[]>([]);
  console.log(currentUser);
  // test only
  useEffect(() => {
    //login detection
    currentUser === null && props.history.push("/login");
    let entry: any = [];
    async function fetchAllEntry() {
      const collectionDest = collection(db, "entrydata");
      console.log(collectionDest);
      const q = query(collectionDest, where("userid", "==", currentUser?.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
          });
      querySnapshot.forEach((doc) =>
          entry.push(doc.data()));
      setEntrylist(entry);
    };
    fetchAllEntry();
  }, [currentUser, props.history])


  return (
      <div>
      <h1>💁‍今までの気持ち💁‍</h1>
      <ul>{entrylist.map((entry) => (
            <li>{JSON.stringify(entry)}</li>
            ))}</ul>
      </div>
      )
}

export default Entries;