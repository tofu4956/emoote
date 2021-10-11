import { Alert } from "react-bootstrap";
import apiData from "./apiKey";
import 'firebase/auth'
import 'firebase/app'
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore, query, where } from "firebase/firestore";
import { collection, addDoc, getDocs} from "firebase/firestore";
import { CredentialContext, CredentialProvider } from "./Authentication";

const TopPage = () => {
    return (
        <div>
            <h2>🥳絵文字で気持ちを表現しよう👊</h2>
        </div>
    )
}

export default TopPage;