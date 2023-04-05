import { Link, Redirect } from 'react-router-dom';
import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { auth } from "./firebase-config";

export function SignUpPage() {
  const [redirect, setRedirect] = useState("");
  if (redirect) {
    return <Redirect to={redirect}></Redirect>
  } else {
    return <SignUp redirect={redirect} setRedirect={setRedirect}></SignUp>
  }
}

export function SignUp(props) {
  const { redirect, setRedirect } = props;
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const signUp = (event, userName, email, pwd) => {
    event.preventDefault();
    setError("");
    createUserWithEmailAndPassword(auth, email, pwd)
      .then(() => {
        setRedirect("/");
        const auth = getAuth();
        updateProfile(auth.currentUser, {
          displayName: userName
        })
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <section className="login-section">
      <h2>Welcome to MGL</h2>
      {error && <p className="error">{error}</p>}
      <img className="profile-img" src="img/profile.png" alt="profile" />
      <form className="login-form">
        <label htmlFor="username-input">Username:</label>
        <input id="username-input"
          type="text"
          placeholder="Create a username"
          onChange={(e) => setUserName(e.target.value)}
          required />
        <label htmlFor="email-input">Email:</label>
        <input id="email-input"
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required />
        <label htmlFor="pw-input">Password:</label>
        <input id="pw-input"
          type="password"
          placeholder="Create a password"
          onChange={(e) => setPwd(e.target.value)}
          required />
        <Link className="btn"
          to={redirect}
          onClick={(event) => signUp(event, userName, email, pwd, setRedirect, setError)}>Sign Up</Link>
      </form>
      <button className="google-signin" onClick={() => signUpWithGoogle(setRedirect, setError)}>
        <img src="./img/google-brands.svg" alt="google signin logo"></img>
        <p>Sign up with Google</p>
      </button>
    </section>
  );
}

function signUpWithGoogle(setRedirect, setError) {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).then(() => {
    setRedirect("/");
  }).catch((error) => {
    setError(error.message);
  });
}