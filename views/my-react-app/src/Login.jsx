import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from './AuthContext';

const Login = () => {
  const { handleLogin } = useAuth(); // Get handleLogin from context
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const showAlert = (type, message) => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', email);
      
      const response = await fetch('http://127.0.0.1:3000/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password
        })
      });
  
      const data = await response.json();
      console.log('Login response data:', data);
  
      if (response.ok && data.status === 'success') {
        
        // Store the token for Bearer authentication
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        // Store user data
        if (data.data && data.data.user) {
          const userData = {
            id: data.data.user._id,
            name: data.data.user.name,
            email: data.data.user.email,
            photo: data.data.user.photo,
            role: data.data.user.role
          };
          localStorage.setItem('user', JSON.stringify(userData));
          
          // USE CONTEXT INSTEAD OF PROP
          handleLogin(userData); // This will update the global user state
        }
  
          window.location.href = '/me';
     
      } else {
        alert(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.log('Login error:', err);
      alert('Network error. Please try again.');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      // Form is valid, attempt login
      await login(formData.email, formData.password);
    } else {
      setErrors(formErrors);
    }
    
    setLoading(false);
  };

  return (
    <> 
      <Header/>
      <main className="main">
        <div className="login-form">
          <h2 className="heading-secondary ma-bt-lg fs-2">Log into your account</h2>
          <form className="form form--login" onSubmit={handleSubmit} noValidate>
            <div className="form__group">
              <label className="form__label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                className={`form__input ${errors.email ? 'form__input--error' : ''}`}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {errors.email && <span className="form__error">{errors.email}</span>}
            </div>
            
            <div className="form__group ma-bt-md">
              <label className="form__label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className={`form__input ${errors.password ? 'form__input--error' : ''}`}
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
                disabled={loading}
              />
              {errors.password && <span className="form__error">{errors.password}</span>}
            </div>
            
            <div className="form__group">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer/>
    </>
  );
};

export default Login;