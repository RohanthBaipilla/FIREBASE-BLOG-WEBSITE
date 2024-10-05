import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Adjust import path as needed
import { onAuthStateChanged } from 'firebase/auth';
import './Navbar.css'; // Import the new CSS file for styling

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user state based on authentication state
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null); // Clear user state after signing out
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbarTitle">BLOG WEBSITE</div> {/* Left-aligned title */}
      <ul className="navList">
        {user ? (
          // Authenticated user navigation
          <>
            <li className="navItem">
              <Link to="/" className="navLink">Home</Link>
            </li>
            <li className="navItem">
              <Link to="/create-blog" className="navLink">Create Blog</Link>
            </li>
            <li className="navItem">
              <Link to="/user-blogs" className="navLink">My Blogs</Link>
            </li>
            <li className="navItem">
              <Link to="/profile" className="navLink">Your Profile</Link>
            </li>
            <li className="navItem">
              <button onClick={handleSignOut} className="signOutButton">Sign Out</button>
            </li>
          </>
        ) : (
          // Guest navigation
          <>
            <li className="navItem">
              <Link to="/" className="navLink">Home</Link>
            </li>
            <li className="navItem">
              <Link to="/login" className="navLink">Login</Link>
            </li>
            <li className="navItem">
              <Link to="/signup" className="navLink">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
