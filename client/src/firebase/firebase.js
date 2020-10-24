import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const setUpRecaptcha = (callback) => {
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "invisible",
      callback: function(response) {
        console.log("Captcha Resolved");
        //this.onSignInSubmit();
        callback();
      },
      defaultCountry: "IN",
    }
  );
};

export const sendSMS = (phoneNumber) => {
  setUpRecaptcha(sendSMS);
  let appVerifier = window.recaptchaVerifier;
  return firebase
    .auth()
    .signInWithPhoneNumber(phoneNumber, appVerifier);
};

export const onSubmitOtp = (otpInput) => {
  let optConfirm = window.confirmationResult;
  // console.log(codee);
  return optConfirm.confirm(otpInput);
};
