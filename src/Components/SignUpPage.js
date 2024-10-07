import axios from 'axios';
import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa'; // For the info icon
import { Link } from 'react-router-dom';

export default function SignUpPage() {
  const [firstName, setFirstNameName] = useState('');
  const [lastName, setLastNameName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(''); // Track password strength

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup', {
        firstName,
        lastName,
        email,
        password,
      });
      console.log(response.data.jwt);
      localStorage.setItem('token', response.data.jwt);
      alert("Login successful!");
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[\W_]/)) return 'strong';
    return 'medium';
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(checkPasswordStrength(pwd));
  };

  const getBorderColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'border-red-500';
      case 'medium':
        return 'border-orange-500';
      case 'strong':
        return 'border-green-500';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100" style={{ paddingTop: "4%", paddingBottom: "4%" }}>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Create an Account</h2>
        <p className="text-center text-gray-600 mb-6">Enter your details to sign up</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstNameName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastNameName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className={`mt-1 block w-full px-3 py-2 bg-white border ${getBorderColor()} rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
            <FaInfoCircle className="absolute right-2 top-8 text-blue-500" title="Red: Weak, Orange: Medium, Green: Strong" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`mt-1 block w-full px-3 py-2 bg-white border ${password !== confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
            />
            {password !== confirmPassword && <p className="text-red-500 text-xs mt-1">Passwords do not match</p>}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Account
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Log in
          </Link>
        </p>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
