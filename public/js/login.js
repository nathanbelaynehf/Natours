/* eslint-disable */
const login = async (email, password) => {
  try {
    console.log('Login function called with:', email);
    
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    console.log('Login response:', res.data);

    if (res.data.status === 'success') {
      // Check if showAlert exists before calling it
      if (typeof showAlert === 'function') {
        showAlert('success', 'Logged in successfully!');
      } else {
        alert('Logged in successfully!'); // Fallback
      }
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      console.log('Unexpected response:', res.data);
    }
  } catch (err) {
    console.log('Login error:', err);
    // Safe error handling without showAlert
    if (typeof showAlert === 'function') {
      showAlert('error', err.response?.data?.message || 'Login failed');
    } else {
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  }
};

// Form handler
if (document.querySelector('.form--login')) {
  document.querySelector('.form--login').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Form submitted:', email);
    login(email, password);
  });
  console.log('Login form handler attached!');
}

const logout = async () => {
  try {
    console.log('Attempting logout...');
    
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });

    console.log('Logout response:', res.data);

    if (res.data.status === 'success') {
      // Safe success handling
      if (typeof showAlert === 'function') {
        showAlert('success', 'Logged out successfully!');
      } else {
        alert('Logged out successfully!');
      }
      
      // Reload the page to update UI state
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
    
  } catch (err) {
    console.log('Logout error:', err);
    // Safe error handling
    const errorMessage = err.response?.data?.message || err.message || 'Logout failed';
    if (typeof showAlert === 'function') {
      showAlert('error', errorMessage);
    } else {
      alert('Logout failed: ' + errorMessage);
    }
  }
};

// Logout button handler
if (document.querySelector('.nav__el--logout')) {
  document.querySelector('.nav__el--logout').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Logout button clicked');
    logout();
  });
  console.log('Logout button handler attached!');
}