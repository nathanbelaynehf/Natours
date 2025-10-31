import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Header() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  return (
    <>
      <header className="header">
        {/* Hamburger menu button - left edge */}
        <button 
          className="header__mobile-toggle"
          onClick={toggleMobileMenu}
        >
          ☰
        </button>

        {/* All tours link - right edge */}
        <nav className="nav nav--tours">
          <Link to="/" className="nav__el">All tours</Link>
        </nav>
        
        {/* Logo - center */}
        <div className="header__logo">
          <Link to="/">
            <img src="/img/logo-white.png" alt="Natours logo" />
          </Link>
        </div>
        
        {/* User menu */}
        <nav className={`nav nav--user ${isMobileMenuOpen ? 'nav--user-mobile-open' : ''}`}>
          {user ? (
            // Logged in user
            <>
              <button onClick={handleLogout} className="nav__el nav__el--logout">
                Log out
              </button>
              <Link to="/me" className="nav__el" onClick={() => setIsMobileMenuOpen(false)}>
                <img 
                  src={`/img/users/${user.photo}`} 
                  alt={`Photo of ${user.name}`}
                  className="nav__user-img" 
                />
                <span className="user-name">{user.name.split(' ')[0]}</span>
              </Link>
            </>
          ) : (
            // Guest user
            <>
              <Link to="/login" className="nav__el" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
              <Link to="/signup" className="nav__el nav__el--cta" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
            </>
          )}
        </nav>
      </header>

      <style>{`
        /* Increased header height */
        .header {
          height: 10rem !important;
          min-height: 10rem !important;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .header {
            flex-wrap: wrap;
            height: 10rem !important;
            min-height: 10rem !important;
            padding: 0 2rem;
            position: relative;
          }

          /* Hamburger menu - left edge */
          .header__mobile-toggle {
            display: flex !important;
            align-items: center;
            order: 1;
            background: none;
            border: none;
            color: #f7f7f7;
            font-size: 2.8rem;
            cursor: pointer;
            padding: 1rem;
            margin-right: auto;
          }

          /* All tours - right edge */
          .nav--tours {
            order: 2;
            margin-bottom: 0 !important;
            margin-left: auto;
          }

          .nav--tours .nav__el {
            font-size: 1.6rem;
            font-weight: 500;
          }

          /* Logo - center */
          .header__logo {
            order: 3;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            margin-bottom: 0 !important;
          }

          .header__logo img {
            height: 4rem !important;
          }

          /* User menu - hidden by default, shows on hamburger click */
          .nav--user {
            order: 4;
            display: none;
            width: 100%;
            flex-direction: column;
            background-color: #444;
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1000;
            padding: 2rem 0;
            border-top: 1px solid rgba(255,255,255,0.2);
          }

          .nav--user-mobile-open {
            display: flex !important;
          }

          .nav--user .nav__el {
            justify-content: center;
            margin: 1rem 0 !important;
            width: 100%;
            font-size: 1.6rem;
            padding: 1rem 2rem;
          }

          .user-name {
            display: inline-block;
          }

          .nav__el--logout {
            background: rgba(255,255,255,0.1);
            border-radius: 5px;
            padding: 1rem 2rem;
          }

          .nav__el--cta {
            background: rgba(255,255,255,0.1);
            border: 2px solid #f7f7f7;
            border-radius: 5px;
            padding: 1rem 2rem;
          }
        }

        /* Small mobile styles */
        @media (max-width: 480px) {
          .header {
            padding: 0 1.5rem;
          }

          .header__mobile-toggle {
            font-size: 2.4rem;
            padding: 0.8rem;
          }

          .nav--tours .nav__el {
            font-size: 1.4rem;
          }

          .header__logo img {
            height: 3.5rem !important;
          }
        }

        /* Desktop: hide hamburger */
        @media (min-width: 769px) {
          .header__mobile-toggle {
            display: none !important;
          }
        }

        /* Override the original media queries */
        @media only screen and (max-width: 62.5em) {
          .header {
            flex-direction: row !important;
            flex-wrap: wrap;
            height: 10rem !important;
          }
          
          .header__logo {
            order: 0 !important;
            margin-bottom: 0 !important;
          }
        }

        @media only screen and (max-width: 37.5em) {
          .nav--tours,
          .nav--user {
            flex-direction: row !important;
          }
          
          .nav__el:not(:last-child) {
            margin-right: 2rem !important;
            margin-bottom: 0 !important;
          }
        }
      `}</style>
    </>
  )
}

export default Header