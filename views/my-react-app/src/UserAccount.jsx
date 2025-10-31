import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';

// NavItem component
const NavItem = ({ link, text, icon, active }) => {
  return (
    <li className={active ? 'side-nav--active' : ''}>
      <Link to={link}>
        <svg>
          <use xlinkHref={`/img/icons.svg#icon-${icon}`}></use>
        </svg>
        {text}
      </Link>
    </li>
  );
};

const UserAccount = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    photo: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [message, setMessage] = useState('');

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First, try to get user from localStorage (from login)
        const localUser = localStorage.getItem('user');
        if (localUser) {
          try {
            const parsedUser = JSON.parse(localUser);
            console.log('Found user in localStorage:', parsedUser);
            setUser(parsedUser);
            setUserData({
              name: parsedUser.name || '',
              email: parsedUser.email || '',
              photo: parsedUser.photo || ''
            });
          } catch (parseError) {
            console.error('Error parsing localStorage user:', parseError);
          }
        }

        // Then try API authentication
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token ? 'Exists' : 'Missing');
        
        if (token) {
          try {
            const response = await fetch('https://natours-1-zy39.onrender.com/api/v1/users/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            console.log('API response status:', response.status);
            
            if (response.ok) {
              const data = await response.json();
              console.log('API auth successful - full response:', data);
              
              // SAFE ACCESS: Check if data.data.user exists before accessing properties
              if (data.data && data.data.user) {
                console.log('User data from API:', data.data.user);
                setUser(data.data.user);
                setUserData({
                  name: data.data.user.name || '',
                  email: data.data.user.email || '',
                  photo: data.data.user.photo || ''
                });
                localStorage.setItem('user', JSON.stringify(data.data.user));
              } else {
                console.log('No user data in API response, keeping localStorage user');
                // Keep the localStorage user since API didn't return user data
              }
            } else {
              console.log('API auth failed, using localStorage user');
              // Keep the localStorage user if API fails
            }
          } catch (apiError) {
            console.error('API auth error:', apiError);
            // Keep the localStorage user if API fails
          }
        } else {
          console.log('No token found, using localStorage user if available');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Don't set user to null here - keep localStorage user if available
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserDataSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://natours-1-zy39.onrender.com/api/v1/users/updateMe', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email
        })
      });

      const responseData = await response.json();
      console.log('Update response:', responseData);

      if (response.ok) {
        setMessage('Settings updated successfully!');
        // Update user state and localStorage
        if (responseData.data && responseData.data.user) {
          setUser(responseData.data.user);
          localStorage.setItem('user', JSON.stringify(responseData.data.user));
        }
      } else {
        throw new Error(responseData.message || 'Failed to update settings');
      }
    } catch (error) {
      setMessage('Error updating settings: ' + error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setMessage('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      setAuthLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://natours-1-zy39.onrender.com/api/v1/users/updateMyPassword', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          passwordCurrent: passwordData.currentPassword,
          password: passwordData.newPassword,
          passwordConfirm: passwordData.confirmPassword
        })
      });

      const responseData = await response.json();
      console.log('Password update response:', responseData);

      if (response.ok) {
        setMessage('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Update token after password change
        if (responseData.token) {
          localStorage.setItem('token', responseData.token);
        }
        
        // Update user data
        if (responseData.data && responseData.data.user) {
          setUser(responseData.data.user);
          localStorage.setItem('user', JSON.stringify(responseData.data.user));
        }
      } else {
        throw new Error(responseData.message || 'Failed to update password');
      }
    } catch (error) {
      setMessage('Error updating password: ' + error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file);
      // Photo upload logic would go here
    }
  };

  if (loading) {
    return (
      <main className="main">
        <div className="user-view">
          <div className="user-view__content">
            <div>Loading...</div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="main">
        <div className="user-view">
          <div className="user-view__content">
            <p>Please log in to view your account settings.</p>
            <Link to="/login" className="btn btn--green">Log In</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
    <Header/>
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <NavItem 
              link="/me" 
              text="Settings" 
              icon="settings" 
              active={location.pathname === '/me'} 
            />
            <NavItem 
              link="/my-tours" 
              text="My bookings" 
              icon="briefcase" 
              active={location.pathname === '/my-tours'} 
            />
            <NavItem 
              link="#" 
              text="My reviews" 
              icon="star" 
              active={location.pathname === '/my-reviews'} 
            />
            <NavItem 
              link="#" 
              text="Billing" 
              icon="credit-card" 
              active={location.pathname === '/billing'} 
            />
          </ul>

          {user.role === 'admin' && (
            <div className="admin-nav">
              <h5 className="admin-nav__heading">Admin</h5>
              <ul className="side-nav">
                <NavItem link="#" text="Manage tours" icon="map" />
                <NavItem link="#" text="Manage users" icon="users" />
                <NavItem link="#" text="Manage reviews" icon="star" />
                <NavItem link="#" text="Manage bookings" icon="briefcase" />
              </ul>
            </div>
          )}
        </nav>

        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Your account settings</h2>
            
            {message && (
              <div className={`alert alert--${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
            
            <form className="form form-user-data" onSubmit={handleUserDataSubmit}>
              <div className="form__group">
                <label className="form__label" htmlFor="name">Name</label>
                <input
                  id="name"
                  className="form__input"
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleUserDataChange}
                  required
                  disabled={authLoading}
                />
              </div>
              
              <div className="form__group ma-bt-md">
                <label className="form__label" htmlFor="email">Email address</label>
                <input
                  id="email"
                  className="form__input"
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleUserDataChange}
                  required
                  disabled={authLoading}
                />
              </div>
              
              <div className="form__group form__photo-upload">
                <img 
                  src={`/img/users/${user.photo}`} 
                  alt="User photo" 
                  className="form__user-photo" 
                />
                <input
                  className="form__upload"
                  type="file"
                  accept="image/*"
                  id="photo"
                  name="photo"
                  onChange={handlePhotoChange}
                  disabled={authLoading}
                />
                <label htmlFor="photo">Choose new photo</label>
              </div>
              
              <div className="form__group right">
                <button 
                  type="submit" 
                  className="btn btn--small btn--green"
                  disabled={authLoading}
                >
                  {authLoading ? 'Saving...' : 'Save settings'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="line">&nbsp;</div>
          
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>
            <form className="form form-user-password" onSubmit={handlePasswordSubmit}>
              <div className="form__group">
                <label className="form__label" htmlFor="password-current">Current password</label>
                <input
                  id="password-current"
                  className="form__input"
                  type="password"
                  name="currentPassword"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                  disabled={authLoading}
                />
              </div>
              
              <div className="form__group">
                <label className="form__label" htmlFor="password">New password</label>
                <input
                  id="password"
                  className="form__input"
                  type="password"
                  name="newPassword"
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                  disabled={authLoading}
                />
              </div>
              
              <div className="form__group ma-bt-lg">
                <label className="form__label" htmlFor="password-confirm">Confirm password</label>
                <input
                  id="password-confirm"
                  className="form__input"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                  disabled={authLoading}
                />
              </div>
              
              <div className="form__group right">
                <button 
                  type="submit" 
                  className="btn btn--small btn--green btn--save-password"
                  disabled={authLoading}
                >
                  {authLoading ? 'Saving...' : 'Save password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
    </>
  );
};

export default UserAccount;