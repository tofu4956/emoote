import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import { EmojiObject, EmojiPicker, EmojiPickerRef, throttleIdleTask, unifiedToNative } from 'react-twemoji-picker';
import EmojiData from "react-twemoji-picker/data/twemoji.json";
import "react-twemoji-picker/dist/EmojiPicker.css"
import "react-twemoji-picker/dist/Emoji.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { Form, Button, ButtonGroup } from 'react-bootstrap';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/react-hooks';
import { BrowserRouter, Route } from 'react-router-dom';
import Showentry from './Showentry';

function App() {
  const cache_entry = new InMemoryCache();
  const cache_login = new InMemoryCache();
  const client_entry = new ApolloClient({
    uri: "http://localhost:8000/graphql",
    cache: cache_entry,
  });
  const client_login = new ApolloClient({
   uri: "http://localhost:8001/graphql",
    cache: cache_login,
  })
  const picker = useRef<EmojiPickerRef>(null)
  const input = useRef<HTMLInputElement>(null)
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
  return (
    <BrowserRouter>
    <ApolloProvider client={client_entry}>
    <div className="App">
      <header className="App-header">
          <a href="https://github.com/tofu4956/emoote">
            ❗This application is PoC version. Stored data may be removed.❗
          </a>
      </header>
      <Route path="/app">
        <h2> 今の気持ちは？ </h2>
        <Form>
         <Form.Control plaintext readOnly value={selectedEmoji}/>
        </Form>
        <ButtonGroup size="lg" className="mb-2">
          <Button >これ！</Button>
          <Button variant="warning" onClick={()=>setEmoji("")}>選び直す</Button>
        </ButtonGroup>
        <EmojiPicker {...emojiPickerProps}/>

      </Route>
      <Route path="/login" component={login}/>
      <Route path="/entry" component={Showentry}/>
      </div>
    </ApolloProvider>
    </BrowserRouter>
  );
  function login(){
    return(
      <div className="login">
        <ApolloProvider client={client_login}>
        <h1>Login</h1>
        <Form>
         <Form.Group className="mb-3" controlId="formBasicEmail">
           <Form.Label>Email address</Form.Label>
           <Form.Control type="email" placeholder="Enter email" />
         </Form.Group>
         <Form.Group className="mb-3" controlId="formBasicPassword">
           <Form.Label>Password</Form.Label>
           <Form.Control type="password" placeholder="Password" />
           </Form.Group>
           <Form.Group className="mb-3" controlId="formBasicCheckbox">
             <Form.Check type="checkbox" label="Check me out" />
           </Form.Group>
         <Button variant="primary" type="submit">
         Login
        </Button>
       </Form>
       </ApolloProvider>
      </div>
    );
  }
}

export default App;
