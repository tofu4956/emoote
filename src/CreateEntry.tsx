import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import { EmojiObject, EmojiPicker, EmojiPickerRef, throttleIdleTask, unifiedToNative } from "react-twemoji-picker";
import { CredentialContext } from "./Authentication";
import EmojiData from "react-twemoji-picker/data/twemoji.json";
import "react-twemoji-picker/dist/EmojiPicker.css"
import "react-twemoji-picker/dist/Emoji.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { Form, Button, ButtonGroup } from 'react-bootstrap';
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import apiData from "./apiKey";
import { selectHttpOptionsAndBody } from "@apollo/client";

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

export default function CreateEntry(props: any){
  const picker = useRef<EmojiPickerRef>(null)
    const input = useRef<HTMLInputElement>(null)
    const {currentUser} = useContext(CredentialContext);
  const [selectedEmoji, setEmoji] =  useState("");
  // need reference to same function to throttle
  const throttledQuery = useCallback(throttleIdleTask((query: string) => picker.current?.search(query)), [picker.current]);
  const inputProps = {
     ref: input,
     placeholder: "search-or-navigate",
     onChange: (event: ChangeEvent<HTMLElement>) => throttledQuery((event.target as HTMLInputElement).value.toLowerCase()),
     onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => { 
       if (!["Enter", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
       picker.current?.handleKeyDownScroll(event); 
       if (event.key === "Enter" && !event.shiftKey) {
         picker.current?.search("");
       }
     },
  }
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
      console.log(selectedEmoji.length);
      try{
        if(selectedEmoji.length === 2){
        const docRef = await addDoc(collection(db, "entrydata"), {
          userid: currentUser !== (null) ? (currentUser !== (undefined) ? currentUser.uid : undefined) : null,  
          entry: selectedEmoji,
          date: new Date()
        });
          console.log(docRef.id);
        }else if(selectedEmoji.length === 0){
        }else{
          throw new Error("lengthError: If you change the element using Inspector tool or bot, please don't. Breaking the concept of application is not welcome.");
        }
      }catch(e){
        console.error("error adding content:", e);
        alert("error!");
      }
    e.preventDefault();
  }
  return(
      <div className="app">
      <h2> 今の気持ちは？ </h2>
      <Form onSubmit={entrySubmitHandler}>
      <Form.Control plaintext readOnly value={selectedEmoji}/>
      <ButtonGroup size="lg" className="mb-2">
      <Button type="submit">これ！</Button>
      <Button variant="warning" onClick={()=>setEmoji("")}>選び直す</Button>
      </ButtonGroup>
      <EmojiPicker {...emojiPickerProps}/>
      </Form>
      </div>
      )
}
