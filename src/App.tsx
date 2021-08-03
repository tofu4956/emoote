import React, { ChangeEvent, useCallback, useRef } from 'react';
import logo from './logo.svg';
import { Button } from 'react-bootstrap';
import { EmojiObject, EmojiPicker, EmojiPickerRef, throttleIdleTask, unifiedToNative } from 'react-twemoji-picker';
import EmojiData from "react-twemoji-picker/data/twemoji.json";
import "react-twemoji-picker/dist/EmojiPicker.css"
import "react-twemoji-picker/dist/Emoji.css"
import './App.css';

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
    copyToClipboard(nativeEmoji);
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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Foooooooooooooo!!!!!!
        </a>
        <Button
          href="./App.tsx" 
          variant="primary"
        >
          Hello?
        </Button>{}
        <EmojiPicker {...emojiPickerProps}/>
      </header>
    </div>
  );
}

export default App;
