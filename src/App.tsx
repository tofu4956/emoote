import React, { useContext, useEffect } from 'react';
import "react-twemoji-picker/dist/EmojiPicker.css";
import "react-twemoji-picker/dist/Emoji.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import Showentry from './Showentry';
import Login from './Login';
import {CredentialContext, CredentialProvider} from './Authentication';
import CreateEntry from './CreateEntry';
import Switch from 'react-bootstrap/esm/Switch';
import Button from 'react-bootstrap/esm/Button';
import TopPage from './TopPage';
import { Container, Nav, Navbar, NavbarBrand } from 'react-bootstrap';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import { initializeApp } from 'firebase/app';
import {getAuth} from 'firebase/auth';
import apiData from './apiKey';

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = initializeApp(firebaseConfig);
const auth = getAuth();

function App(props: any) {
  const {currentUser} = useContext(CredentialContext);
  useEffect(() => {
    // if not logged in, redirect to login page
    currentUser === null && props.history.push("/login");
  }, [currentUser, props.history]);

  const LoginButton = () => {
  
    const {currentUser} = useContext(CredentialContext);
    if(currentUser === null){
      return (
        <>{
        <Nav className="button-data">
          <Button href="/login">ログイン</Button>
        </Nav>}
        </>
      )
    }
    else{
      <Button className="button-data">error</Button>
    }
    return (
      <Button className="button-data" onClick={async event=>{
        try {
          await auth.signOut();
        }
        catch (e :any) {
          alert(e.message);
        }
        }}
      >
        ログアウト
      </Button>
    )
  }




  return (
    <BrowserRouter>
    <Switch>
      <CredentialProvider>
    <div className="App">
      <header className="App-header">
          <a href="https://github.com/tofu4956/emoote">
            ❗This application is PoC version. Stored data may be removed.❗
          </a>
      </header>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <NavbarBrand href="/top">emoote</NavbarBrand>
          <NavbarCollapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link href="/app">気持ちを記録</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="/entry">今までの気持ち</Nav.Link>
            </Nav>
            <LoginButton />
          </NavbarCollapse>
        </Container>
      </Navbar>
      <Route path="/top" component={TopPage}/>
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
