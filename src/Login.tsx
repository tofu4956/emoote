import React, {useContext, useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import apiData from './apiKey';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { CredentialContext } from './Authentication';
import './App.css';
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

interface Logininterface {
  email: string;
  password: string;
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app);

function Login(props: any){
  const [email, setEmail] = useState<Logininterface["email"]>('');
  const [password, setPassword] = useState<Logininterface["password"]>('');
  const {currentUser} = useContext(CredentialContext);
  const LoginHandler = (e :any) =>{
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredencial) => {
        const user = userCredencial.user;
        console.log(user);
        props.history.push("/top");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage =error.message;
        console.log(errorMessage + " / " + errorCode);
      })
    e.preventDefault();
  }
  useEffect(() => {
    // if logged in, redirect to home
    currentUser && props.history.push("/");
  }, [currentUser, props.history]);
  return(
      <div className="login">
        <h1>Login</h1>
        <Form onSubmit = {LoginHandler}>
         <Form.Group className="form" controlId="formBasicEmail">
           <Form.Label>Email address</Form.Label>
           <Form.Control type="email" placeholder="Enter email" onChange={event => setEmail(event.target.value)}/>
         </Form.Group>
         <Form.Group className="form" controlId="formBasicPassword">
           <Form.Label>Password</Form.Label>
           <Form.Control type="password" placeholder="Password" onChange={event => setPassword(event.target.value)}/>
          </Form.Group>
          <br/>
         <Button className="button" variant="primary" type="submit">
         Login
        </Button>
        <>
        <p>debug: Login:example@example.com / password: example</p>
        </>
       </Form>
      </div>
  );
}
export default Login;

