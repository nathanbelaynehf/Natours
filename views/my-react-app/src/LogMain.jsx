import React, { useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import Login from './Login'

function LogMain() {
  const [user, setUser] = useState(null);
  const handleLogin = (userData) => {
    setUser(userData);
  };
  return (
    <>
    <Header/>
    <Login onLogin={handleLogin}/>
    <Footer/>
    </>
  )
}

export default LogMain