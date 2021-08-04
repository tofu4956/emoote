import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import { EmojiObject, EmojiPicker, EmojiPickerRef, throttleIdleTask, unifiedToNative } from 'react-twemoji-picker';
import EmojiData from "react-twemoji-picker/data/twemoji.json";
import "react-twemoji-picker/dist/EmojiPicker.css"
import "react-twemoji-picker/dist/Emoji.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { Form, Button } from 'react-bootstrap';

const copyToClipboard = async (string: string) => {
  try {
    // Try to use the Async Clipboard API with fallback to the legacy approach.
    // @ts-ignore
    const {state} = await navigator.permissions.query({name: 'clipboard-write'});
    if (state !== 'granted') { throw new Error('Clipboard permission not granted'); }
    await navigator.clipboard.writeText(string);
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = string;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

function App() {
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
    <div className="App">
      <header className="App-header">
        <a href="https://github.com/tofu4956/emoote">
          ❗This application is PoC version. Stored data may be removed.❗
        </a>
        </header>
        <h2> What is your feelings? </h2>
        <Form>
        <Form.Control plaintext readOnly value={selectedEmoji}/>
        </Form>
        <Button onClick={()=>setEmoji("")}>Clear</Button>
        <EmojiPicker {...emojiPickerProps}/>
    </div>
  );
}

export default App;
