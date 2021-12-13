import { useContext, useEffect, useState } from "react";
import { EmojiObject, EmojiPicker, unifiedToNative } from "react-twemoji-picker";
import { CredentialContext } from "./Authentication";
import EmojiData from "react-twemoji-picker/data/twemoji.json";
import "react-twemoji-picker/dist/EmojiPicker.css"
import "react-twemoji-picker/dist/Emoji.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { Form, Button, ButtonGroup } from 'react-bootstrap';
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import apiData from "./apiKey";
import split from "graphemesplit";

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
const db = initializeFirestore(app, {experimentalForceLongPolling: true});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app);

export default function CreateEntry(props: any){
  const {currentUser} = useContext(CredentialContext);
  const [selectedEmoji, setEmoji] =  useState("");
  // need reference to same function to throttle
  const onEmojiSelect = (emoji: EmojiObject) => {
    const nativeEmoji = unifiedToNative(emoji.unicode);
    setEmoji(nativeEmoji);
    console.log(emoji);
  }
  const emojiPickerProps = {
          emojiData: EmojiData, 
          onEmojiSelect, 
          showNavbar: true, 
          showFooter: true,
          collapseHeightOnSearch: false,
  }
  useEffect(() => {
      //login detection
      currentUser === null && props.history.push("/login");
      }, [currentUser, props.history]);
    async function entrySubmitHandler(e: any){
      try{
        if(split(selectedEmoji).length < 2){
        const docRef = await addDoc(collection(db, "entrydata"), {
          userid: currentUser !== (null) ? (currentUser !== (undefined) ? currentUser.uid : undefined) : null,  
          entry: selectedEmoji,
          date: new Date()
        });
          console.log(split(selectedEmoji).length);
          console.log(docRef.id);
          console.log("ok");
        }else if(split(selectedEmoji).length === 0){
        }else{
          throw new Error("lengthError: If you change the element using Inspector tool or bot, please don't. Breaking the concept of application is not welcome.");
        }
      }catch(e){
        console.error("error adding content:", e);
        alert("error! Please try again");
      }
    e.preventDefault();
  }
  return(
    <div className="app">
      <h2> 今の気持ちは？ </h2>
      <Form className="" onSubmit={entrySubmitHandler}>
      <Form.Control className="form" plaintext readOnly value={selectedEmoji}/>
      <ButtonGroup size="lg" className="mb-2">
        <Button type="submit">これ！</Button>
      <Button variant="warning" onClick={()=>setEmoji("")}>選び直す</Button>
      </ButtonGroup>
      </Form>
      <div className="center">
        <EmojiPicker {...emojiPickerProps}/>
      </div>
    </div>
  )
}
