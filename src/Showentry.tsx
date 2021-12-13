import React, { useContext, useEffect, useState }  from "react";
import apiData from "./apiKey";
import 'firebase/auth'
import 'firebase/app'
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { FirestoreSettings, initializeFirestore, query, where} from "firebase/firestore";
import { collection, getDocs} from "firebase/firestore";
import { CredentialContext } from "./Authentication";
import { ListGroup } from "react-bootstrap";
import format from "date-fns/format";
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

const firestoreSettings: FirestoreSettings & { useFetchStreams: boolean } = {
	useFetchStreams: false,
  experimentalForceLongPolling: true
};
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, firestoreSettings);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app);


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
      const q = query(collectionDest, where("userid", "==", currentUser?.uid !== undefined ? currentUser?.uid : 0));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
          });
      querySnapshot.forEach((doc) =>
          entry.push(doc.data()));
      entry.sort((a: any, b: any) => {
        let x = a.date.seconds;
        let y = b.date.seconds;
        return (y - x);
      });
      setEntrylist(entry);
    };
    fetchAllEntry();
  }, [currentUser, props.history])
  const displayDate = (date: Date) => {
    return (format(date, 'YYYY年MM月DD日 HH:mm:ss'))
  }

  return (
    // 仮置
      <div>
      <h1>💁‍今までの気持ち💁‍</h1>
      <ListGroup className="list">
        {entrylist.map((entry, index) => (
            <ListGroup.Item key={index}><span className="emoji-list-disp">{entry.entry}</span> / {displayDate(entry.date.toDate())}</ListGroup.Item>
        ))}
      </ListGroup>
      <p>debug: {uid} /entry: {entrylist.length}</p>
      </div>
      )
}

export default Entries;