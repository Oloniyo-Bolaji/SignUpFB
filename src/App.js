import React, {useState, useeffect} from "react"
import './App.css';
import Dashboard from './dashboard.js';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import {auth, googleProvider} from "./firebaseConfig.js"
import { createUserWithEmailAndPassword, sendPasswordResetEmail ,signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";

function App() {
  // CREATING STATES
  const [user, setUser] = useState(
    {
      firstname:'',
      lastname:'',
      username:'',
      email:'',
      phoneno:'',
      password:'', 
      displayName:'',
      displayPhoto: '',
      isChecked : false
    }
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [userCreated, setUserCreated] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [isGoogleUser, setIsGoogleUser] = useState(false)
  const [passReset, setPassReset] = useState(false)

  //FUNCTION FOR CREATING NEW USER, WITH CONDITIONS TO BE MET BREFORE CREATING AND ERRORS TO BE DISPLAYED
const signIn =async () => {
  try {
    if(user.firstname !== "" && 
      user.lastname !== "" && 
      user.username !== "" && 
      user.email !== ""  && 
      user.password !== "" && 
      user.password.match(/[0-9]/) && 
      user.password.match(/[A-Z]/)  &&
      user.password.match(/[@#€&*]/) &&
      user.phoneno !== "" && 
      user.isChecked === true){
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password)
      setUserCreated(true)
      setUser({
      ...user, password: '', email: ''
      })
    }else{
      setErrorMessage("Fill in the Required inputs")
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }catch(err){
    console.error("Error code:", err.code);
    if (err.code === 'auth/email-already-in-use') {
      setErrorMessage('Email address already in use');
    } else if (err.code === 'auth/weak-password') {
      setErrorMessage('The password is too weak. Please use at least 6 characters.');
    } else {
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }
}

// TOGGLE FUNCTION 
const handleLogin =() =>{
  setUserCreated(!userCreated)
} 

//FUNCTION FOR LOGGING IN AN ALREADY CRAETED USER
const logIn = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password)
    setLoggedIn(true)
  }catch(err){
    console.log(err)
    console.error("Error code:", err.code);
    if (err.code === 'auth/invalid-credential') {
      setErrorMessage('Invalid Credentials');
    }else {
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }
}

//FUNCTION FOR SIGNING IN WITH GOOGLE
const googleSign = async () => {
  try {
      const userCredential = await signInWithPopup(auth, googleProvider)
      setLoggedIn(true)
      setIsGoogleUser(true)
      setUser({
       email: auth?.currentUser?.email,
       displayName: auth?.currentUser?.displayName,
       phoneno : auth?.currentUser?.phoneNumber,
       displayPhoto: auth?.currentUser?.photoURL
      })
      console.log(auth?.currentUser?.photoURL)
    }catch(err){
    console.log(err)
  }
}

//FUNCTION FOR LOGGING OUT USER
const logOut = async () => {
  try {
    await signOut(auth)
    setLoggedIn(false)
    setIsGoogleUser(false);
    setUser({
      ...user,
      email: '',
      password: '',
      displayName: "",
      phoneno: "",
      displayPhoto: "",
    });
  }catch(err){
    console.log(err)
  }
}

return (
  <div className="d-flex justify-content-center align-items-center">
    {loggedIn ? 
     (<Dashboard 
      user={user}
      isGoogleUser={isGoogleUser}
      logOut={logOut}/>): 
   (<div>
      {errorMessage && (
        <div className="alert alert-danger text-danger" role="alert">
          {errorMessage}
        </div>
      )}
      {/** LOGIN PAGE AND SIGN IN PAGE*/}
      {userCreated ? (
        <div className="container p-3">
          <h4>Welcome Back!</h4>
          <p className="text-secondary">To get started, sign in to your account</p>
      
          <div className="d-flex justify-content-center align-items-center flex-column">
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              style={{ width: '350px', height: '40px', marginBottom: '10px', padding: '15px' }}
              className="border-top-0 border-start-0 border-end-0 border-bottom-0"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              style={{ width: '350px', height: '40px', marginBottom: '10px', padding: '15px' }}
              className="border-top-0 border-start-0 border-end-0 border-bottom-0"
            />
          </div>
      
          <div className="d-flex flex-column">
            <div className="d-flex justify-content-center flex-column align-items-center">
              <button className="btn btn-primary" onClick={logIn}>Sign in</button>
      
              <div className="d-flex align-items-center">
                <span className="word">Or</span>
              </div>
      
              <button className="btn btn-my-1 border-danger text-danger" onClick={googleSign}>
                Sign in with Google
              </button>
      
              <p>
                Not a user?{' '}
                <span>
                  <button className="btn btn-link" onClick={handleLogin}>Create Account</button>
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : (
    
      <div className="container p-3">
           <div className="d-flex justify-content-center flex-column ">
           <h4 className="text-center text-primary">Sign Up</h4>
          <input
            type="text"
            name="firstname"
            placeholder="Firstname"
            value={user.firstname}
            onChange={(e) => setUser({ ...user, firstname: e.target.value })}
            style={{ width: '350px', height: '40px', marginBottom: '10px', padding: '15px' }}
            className="border-top-0 border-start-0 border-end-0 border-bottom-0"
          />
          <input
            type="text"
            name="lastname"
            placeholder="Lastname"
            value={user.lastname}
            onChange={(e) => setUser({ ...user, lastname: e.target.value })}
            style={{ width: '350px', height: '40px', marginBottom: '10px' , padding: '15px'}}
            className="border-top-0 border-start-0 border-end-0 border-bottom-0"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            style={{ width: '350px', height: '40px', marginBottom: '10px', padding: '15px' }}
            className="border-top-0 border-start-0 border-end-0 border-bottom-0"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            style={{ width: '350px', height: '40px', marginBottom: '10px', padding: '15px' }}
            className="border-top-0 border-start-0 border-end-0 border-bottom-0"
          />
          <input
            type="tel"
            name="phoneno"
            placeholder="Phone No"
            value={user.phoneno}
            onChange={(e) => setUser({ ...user, phoneno: e.target.value })}
            style={{ width: '350px', height: '40px', marginBottom: '10px', padding: '15px' }}
            className="border-top-0 border-start-0 border-end-0 border-bottom-0"
          /> 
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            style={{ width: '350px', height: '40px', marginBottom: '10px' , padding: '15px'}}
            className="border-top-0 border-start-0 border-end-0 border-bottom border-bottom-0"
          />
        </div>
        <div className="text-secondary">
          <ul>
            <li className={user.password.match(/[0-9]/) ? 'text-success' : ''}>Must contain numbers</li>
            <li className={user.password.match(/[A-Z]/) ? 'text-success' : ''}>Must contain uppercase and lowercase</li>
            <li className={user.password.match(/[@#€&*]/) ? 'text-success' : ''}>Must contain special characters</li>
         </ul>
        </div>
       <div className="form-check d-flex justify-content-start">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault"
            checked={showPassword}
            onChange={(e) => setShowPassword(!showPassword)}
          />
          <label className="form-check-label" htmlFor="flexCheckDefault"> Show Password</label>
      </div>
       <div className="form-check d-flex justify-content-start">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault"
            checked={user.isChecked}
            onChange={(e) => setUser({ ...user, isChecked: e.target.checked })}
           />
            <label className="form-check-label" htmlFor="flexCheckDefault"> I agree to the terms and condition </label>
       </div>
      
        <div className="d-flex justify-content-center flex-column align-items-center">
          <button className="btn btn-primary my-1" onClick={signIn}>Sign Up</button>
        
        </div>
      
       <div className="d-flex justify-content-center">
           <p>Already A User?{' '}
              <span>
                <button className="btn btn-link" onClick={handleLogin}>Login</button>
              </span>
          </p>
        </div>
   </div>
      )}
    </div>)}
    </div>
);
}

export default App;