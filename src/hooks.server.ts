import { initializeApp } from 'firebase/app';

/**
 * @type {import("@firebase/firestore").Firestore}
 */

//firebase initialisation

const firebaseConfig = {
	apiKey: "AIzaSyB-jeB37I6q5aHkja30qS30TmvPzQ-DtRo",
	authDomain: "codelux-df0db.firebaseapp.com",
	projectId: "codelux-df0db",
	storageBucket: "codelux-df0db.appspot.com",
	messagingSenderId: "1082257655878",
	appId: "1:1082257655878:web:c8d68c7609c36e0a2fa247",
	measurementId: "G-0K3NLE7J5D"
  };  

export const app = initializeApp(firebaseConfig);