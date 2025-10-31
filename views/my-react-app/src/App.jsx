import Home from './Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TourDetail from './TourDetail'
import { useState } from 'react';
import UserAccount from './UserAccount';
import Signup from './Signup';
import Login from './Login';
import { AuthProvider } from './AuthContext';


function App() {
 
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/tour/:id" element={<TourDetail />} />
        <Route path="/me" element={<UserAccount />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  </AuthProvider>
  )
}

export default App
