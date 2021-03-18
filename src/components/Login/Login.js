import React, { useContext, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
// import { useForm } from "react-hook-form";
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Login = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [newUser, setNewUser] = useState(false);
  //   const { register, handleSubmit } = useForm();
  const history = useHistory();
  const location = useLocation();

  const { from } = location.state || { from: { pathname: "/" } };

  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const passwordLength = e.target.value.length > 6;
      const passwordValidate = /\d{1}/.test(e.target.value);
      isFieldValid = passwordLength && passwordValidate;
    }
    if (isFieldValid) {
      const newUserInfo = { ...loggedInUser };
      newUserInfo[e.target.name] = e.target.value;
      setLoggedInUser(newUserInfo);
    }
  };
  const handleSubmit = (e) => {
    if (loggedInUser.email && loggedInUser.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          loggedInUser.email,
          loggedInUser.password
        )
        .then((res) => {
          const newUserInfo = { ...loggedInUser };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setLoggedInUser(newUserInfo);
          updateUserName(loggedInUser.name);
          history.push(from);
        })
        .catch((error) => {
          const newUserInfo = { ...loggedInUser };
          newUserInfo.error = error.message;
          setLoggedInUser(newUserInfo);
        });
    }

    if (!newUser && loggedInUser.email && loggedInUser.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(loggedInUser.email, loggedInUser.password)
        .then((res) => {
          const newUserInfo = { ...loggedInUser };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setLoggedInUser(newUserInfo);
          history.push(from)
          console.log("user sign in", res.user);
        })
        .catch((error) => {
          const newUserInfo = { ...loggedInUser };
          newUserInfo.error = error.message;
          setLoggedInUser(newUserInfo);
        });
    }
    e.preventDefault();
  };
  const updateUserName = (name) => {
    const user = firebase.auth().currentUser;
    user
      .updateProfile({
        displayName: name,
      })
      .then((res) => {
        console.log(res.user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="checkbox"
        onChange={() => setNewUser(!newUser)}
        name="newUser"
        id=""
      />
      <label htmlFor="newUser">New User Sign Up</label>
      <br />
      {newUser && (
        <input
          type="text"
          name="name"
          onBlur={handleBlur}
          placeholder="Enter Your name"
          required
        />
      )}
      <br />
      <input
        type="email"
        name="email"
        onBlur={handleBlur}
        placeholder="Enter Your Email"
        required
      />
      <br />
      <input
        type="password"
        onBlur={handleBlur}
        name="password"
        placeholder="Enter Your Password"
        required
      />
      <br />
      <input type="submit" value={newUser ? "Sign Up" : "Sign In"} />
    </form>
  );
};

export default Login;
