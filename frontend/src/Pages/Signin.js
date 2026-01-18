import React, { useContext, useState } from 'react';
import './Signin.css';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext.js';
import Switch from '@material-ui/core/Switch';
import { Link } from 'react-router-dom';

function Signin() {
  const [isStudent, setIsStudent] = useState(true);
  const [admissionId, setAdmissionId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { dispatch } = useContext(AuthContext);

  // Correct API URL with fallback
  const API_URL = process.env.REACT_APP_API_URL || "https://library-management-system-mern-master-wrht.onrender.com";

  const loginCall = async (userCredential, dispatch) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post(API_URL + "https://library-management-system-mern-master-wrht.onrender.com/api/auth/signin", userCredential);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err });
      setError("Wrong Password Or Username");
    }
  };

  const handleForm = (e) => {
    e.preventDefault();

    if (isStudent) {
      loginCall({ admissionId, password }, dispatch);
    } else {
      loginCall({ employeeId, password }, dispatch);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <form onSubmit={handleForm}>
          <h2 className="signin-title">Log in</h2>
          <p className="line"></p>

          <div className="persontype-question">
            <p>Are you a Staff member?</p>
            <Switch
              checked={!isStudent}
              onChange={() => setIsStudent(!isStudent)}
              color="primary"
            />
          </div>

          <div className="error-message">
            <p>{error}</p>
          </div>

          <div className="signin-fields">
            <label htmlFor={isStudent ? "admissionId" : "employeeId"}>
              <b>{isStudent ? "Admission ID" : "Employee ID"}</b>
            </label>

            <input
              className="signin-textbox"
              type="text"
              placeholder={isStudent ? "Enter Admission ID" : "Enter Employee ID"}
              required
              onChange={(e) => {
                if (isStudent) setAdmissionId(e.target.value);
                else setEmployeeId(e.target.value);
              }}
            />

            <label htmlFor="password"><b>Password</b></label>
            <input
              className="signin-textbox"
              type="password"
              minLength="6"
              placeholder="Enter Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="signin-button" type="submit">Log In</button>

          <a className="forget-pass" href="#home">Forgot password?</a>
        </form>

        <div className="signup-option">
          <p className="signup-question">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
