import React, { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { EmojiObject, EmojiPicker, EmojiPickerRef, throttleIdleTask, unifiedToNative } from 'react-twemoji-picker';
import EmojiData from "react-twemoji-picker/data/twemoji.json";
import "react-twemoji-picker/dist/EmojiPicker.css"
import "react-twemoji-picker/dist/Emoji.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { Form, Button, ButtonGroup } from 'react-bootstrap';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import Showentry from './Showentry';
import Login from './Login'
import {CredentialContext, CredentialProvider} from './Authentication'
import CreateEntry from './CreateEntry';
import Switch from 'react-bootstrap/esm/Switch';

function App(props: any) {
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
    // if not logged in, redirect to login page
    currentUser === null && props.history.push("/login");
  }, [currentUser, props.history]);
  return (
    <BrowserRouter>
    <Switch>
      <CredentialProvider>
    <div className="App">
      <header className="App-header">
          <a href="https://github.com/tofu4956/emoote">
            ❗This application is PoC version. Stored data may be removed.❗
          </a>
          <ul>
              <li>
                <Link to="/login">login</Link>
              </li>
              <li>
                <Link to="/app">main page</Link>
              </li>
              <li>
                <Link to="/entry">entry page</Link>
              </li>
            </ul>
      </header>
      <Route path="/"/>
      <Route path="/app" component={CreateEntry}/>
      <Route path="/login" component={Login}/>
      <Route path="/entry" component={Showentry}/>
      </div>
      </CredentialProvider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
