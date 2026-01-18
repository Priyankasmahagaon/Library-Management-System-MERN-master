import React, { useState } from 'react';
import './Signup.css';
import { useHistory } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({
    userType: 'Student',  // matches backend userType
    userFullName: '',
    email: '',
    password: '',
    admissionId: '',
    employeeId: '',
  });

  const [error, setError] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (e) => {
    setForm({
      ...form,
      userType: e.target.value,
      admissionId: '',
      employeeId: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Payload EXACTLY matching your backend
    const payload = {
      userType: form.userType,
      userFullName: form.userFullName,
      email: form.email,
      password: form.password,
      admissionId: form.userType === 'Student' ? form.admissionId : '',
      employeeId: form.userType === 'Staff' ? form.employeeId : '',
      isAdmin: form.userType === 'Staff' ? true : false,
    };

    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Signup successful! Please sign in.');
        history.push('/signin');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit} className="signup-form">

        <select name="userType" value={form.userType} onChange={handleUserTypeChange}>
          <option value="Student">Student</option>
          <option value="Staff">Staff</option>
        </select>

        <input
          type="text"
          name="userFullName"
          placeholder="Full Name"
          value={form.userFullName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {form.userType === 'Student' && (
          <input
            type="text"
            name="admissionId"
            placeholder="Admission ID"
            value={form.admissionId}
            onChange={handleChange}
            required
          />
        )}

        {form.userType === 'Staff' && (
          <input
            type="text"
            name="employeeId"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit">Sign Up</button>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Signup;
