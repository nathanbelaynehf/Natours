import React, { useState } from 'react';
import Header from './Header';
import { useAuth } from './AuthContext';

const Signup = () => {
  const { handleLogin } = useAuth(); // Get handleLogin from context
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
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

  const signup = async (name, email, password, passwordConfirm) => {
    try {
      console.log('Attempting signup with:', { name, email });
      
      const response = await fetch('https://natours-1-zy39.onrender.com/api/v1/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          password,
          passwordConfirm
        })
      });

      const data = await response.json();
      console.log('Signup response data:', data);

      if (response.ok && data.status === 'success') {
        showAlert('success', 'Account created successfully! Welcome to Natours!');
        
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

        window.setTimeout(() => {
          window.location.href = '/me';
        }, 1500);
      } else {
        showAlert('error', data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.log('Signup error:', err);
      showAlert('error', 'Network error. Please try again.');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
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
    
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Please confirm your password';
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      // Form is valid, attempt signup
      await signup(formData.name, formData.email, formData.password, formData.passwordConfirm);
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
          <h2 className="heading-secondary ma-bt-lg fs-2">Create your account</h2>
          <form className="form form--login" onSubmit={handleSubmit} noValidate>
            <div className="form__group">
              <label className="form__label" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                className={`form__input ${errors.name ? 'form__input--error' : ''}`}
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {errors.name && <span className="form__error">{errors.name}</span>}
            </div>
            
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
            
            <div className="form__group">
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
            
            <div className="form__group ma-bt-md">
              <label className="form__label" htmlFor="passwordConfirm">
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                className={`form__input ${errors.passwordConfirm ? 'form__input--error' : ''}`}
                type="password"
                name="passwordConfirm"
                placeholder="••••••••"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                minLength="8"
                disabled={loading}
              />
              {errors.passwordConfirm && <span className="form__error">{errors.passwordConfirm}</span>}
            </div>
            
            <div className="form__group">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Signup;