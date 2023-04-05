import { Link, Redirect } from 'react-router-dom';
import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup
} from "firebase/auth";
import { auth } from "./firebase-config";

export function LoginPage() {
  const [redirect, setRedirect] = useState("");
  if (redirect) {
    return <Redirect to={redirect}></Redirect>
  } else {
    return <Login redirect={redirect} setRedirect={setRedirect}></Login>
  }
}

export function Login(props) {
  const { redirect, setRedirect } = props;
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const signIn = (event, emailAddress, pwd, setRedirect, setError) => {
    event.preventDefault();
    setError("");
    signInWithEmailAndPassword(auth, emailAddress, pwd)
      .then((userCredentials) => {
        let user = userCredentials.user;
        console.log('User signed in: ' + user.uid);
        setRedirect("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  }
  return (
    <section className="login-section">
      <h2>Welcome back to MGL</h2>
      {error && <p className="error">{error}</p>}
      <img className="profile-img" src="img/profile.png" alt="profile" />
      <form className="login-form">
        <label htmlFor="email-input">Email:</label>
        <input id="email-input"
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required />
        <label htmlFor="pw-input">Password:</label>
        <input id="pw-input"
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPwd(e.target.value)}
          required />
        <Link className="btn"
          to={redirect}
          onClick={(event) => signIn(event, email, pwd, setRedirect, setError)}>Login</Link>
      </form>
      <button className="google-signin" onClick={() => signInWithGoogle(setRedirect, setError)}>
        <img src="./img/google-brands.svg" alt="google signin logo"></img>
        <p>Sign in with Google</p>
      </button>
      <p>New to MGL? <Link to="/signup">Create Account</Link></p>
    </section>
  );
}

export function Intro() {
  return (
    <section className="intro-section">
      <h2>Need a way to track all of your games?</h2>
      <p>
        MyGameList or MGL for short is a simple and effective way to keep track of the games you have played, are
        currently playing, and want to play. You can even rate and share the games you have played and connect with
        friends.
      </p>
      <Link className="btn" to="/about">Learn More</Link>
    </section>
  );
}

function signInWithGoogle(setRedirect, setError) {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).then(() => {
    setRedirect("/");
  }).catch((error) => {
    setError(error.message);
  });
}