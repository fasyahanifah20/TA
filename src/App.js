import React, { useEffect } from 'react'; // Pindahkan impor React di atas useEffect
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';
import Router from './router';

const App = () => {
  // Konfigurasi Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyA6R1rzEfKVWiNFu1sTIbMHkH7zQ3EYgBk",
    authDomain: "iftpetfeedercoba.firebaseapp.com",
    databaseURL: "https://iftpetfeedercoba-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "iftpetfeedercoba",
    storageBucket: "iftpetfeedercoba.appspot.com",
    messagingSenderId: "827300223020",  
    appId: "1:827300223020:android:15b3d07f074968687d1989",
    user_email: "petfeederift@gmail.com",
    user_password: "123456"
  };

  // Inisialisasi Firebase
  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }, []);

  return (
    <NavigationContainer>
       <Router/>
    </NavigationContainer>
  );
};

export default App;
