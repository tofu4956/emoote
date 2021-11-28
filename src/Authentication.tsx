import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import React, { useEffect, useState } from "react";
import apiData from "./apiKey";
import 'firebase/auth'
import 'firebase/app'

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const analytics = getAnalytics(app);

interface Authinterface{
  currentUser: User | null | undefined;
}

const CredentialContext = React.createContext<Authinterface>({currentUser: undefined});

const CredentialProvider = (props: any) => {
    const [currentUser, setCurrentUser] = useState<User | null | undefined>(
        undefined
    );
    
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user => {
            setCurrentUser(user);
        })
    )}, [])

    return (
        <CredentialContext.Provider
            value={{
                currentUser: currentUser
            }}
        >
            {props.children}
        </CredentialContext.Provider>
    )
};

export {CredentialContext, CredentialProvider}