// // src/App.js
// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './firebaseConfig'; // Firebase authentication instance
// import Home from './components/Blogs/Home'; // Home page displaying all blogs
// import CreateBlog from './components/Blogs/CreateBlog'; // Create blog (private)
// import UserBlogs from './components/Blogs/UserBlogs'; // User blogs (private)
// import UpdateBlog from './components/Blogs/UpdateBlog'; // Update blog (private)
// import Login from './components/Auth/Login'; // Login page
// import Signup from './components/Auth/Signup'; // Signup page
// import Profile from './components/Profile'; // Profile page (private)
// import Navbar from './components/Navbar'; // Navbar

// // PrivateRoute Component: Ensures only authenticated users can access private routes
// const PrivateRoute = ({ user, children }) => {
//   return user ? children : <Navigate to="/login" />;
// };

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Listen to Firebase authentication state changes
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Show loading state until Firebase auth state is resolved
//   if (loading) {
//     return <div>Loading...</div>; // You can replace this with a loading spinner
//   }

//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         {/* Public route: Home page (display all blogs) */}
//         <Route path="/" element={<Home />} />

//         {/* Public route: Login page (accessible only if not logged in) */}
//         <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

//         {/* Public route: Signup page (accessible only if not logged in) */}
//         <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

//         {/* Private route: Profile page (only logged-in users can access) */}
//         <Route
//           path="/profile"
//           element={
//             <PrivateRoute user={user}>
//               <Profile />
//             </PrivateRoute>
//           }
//         />

//         {/* Private route: User blogs (only logged-in users can access) */}
//         <Route
//           path="/user-blogs"
//           element={
//             <PrivateRoute user={user}>
//               <UserBlogs />
//             </PrivateRoute>
//           }
//         />

//         {/* Private route: Update blog (only logged-in users can access) */}
//         <Route
//           path="/update-blog/:id"
//           element={
//             <PrivateRoute user={user}>
//               <UpdateBlog />
//             </PrivateRoute>
//           }
//         />

//         {/* Private route: Create blog (only logged-in users can access) */}
//         <Route
//           path="/create-blog"
//           element={
//             <PrivateRoute user={user}>
//               <CreateBlog />
//             </PrivateRoute>
//           }
//         />

//         {/* Catch-all route for 404 page */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Firebase authentication instance
import Home from './components/Blogs/Home'; // Home page displaying all blogs
import CreateBlog from './components/Blogs/CreateBlog'; // Create blog (private)
import UserBlogs from './components/Blogs/UserBlogs'; // User blogs (private)
import UpdateBlog from './components/Blogs/UpdateBlog'; // Update blog (private)
import Login from './components/Auth/Login'; // Login page
import Signup from './components/Auth/Signup'; // Signup page
import Profile from './components/Profile'; // Profile page (private)
import ViewBlog from './components/Blogs/ViewBlog'; // New component for viewing a blog
import Navbar from './components/Navbar'; // Navbar

const AUTO_LOGOUT_TIME = 7 * 60 * 1000; // 7 minutes

const PrivateRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutTimer, setLogoutTimer] = useState(null);

  // Function to log out the user
  const logoutUser = async () => {
    await auth.signOut();
    setUser(null);
    clearTimeout(logoutTimer); // Clear the timer after logout
  };

  // Function to reset the inactivity timer
  const resetLogoutTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer); // Clear any existing timers
    // Set a new timer for the auto logout
    const timer = setTimeout(() => {
      logoutUser(); // Log out user after inactivity
    }, AUTO_LOGOUT_TIME);

    setLogoutTimer(timer); // Update the logout timer state
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        resetLogoutTimer(); // Start/reset logout timer if user is authenticated
      } else {
        clearTimeout(logoutTimer); // Clear the timer if the user logs out
      }
    });

    return () => unsubscribe();
  }, []);

  // Adding event listeners to track user activity and reset the logout timer
  useEffect(() => {
    if (user) {
      const events = ['mousemove', 'click', 'keydown', 'scroll', 'touchstart']; // Track these events

      // Reset the inactivity timer on any user activity
      events.forEach((event) => window.addEventListener(event, resetLogoutTimer));

      // Cleanup event listeners on component unmount
      return () => {
        events.forEach((event) => window.removeEventListener(event, resetLogoutTimer));
      };
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        <Route path="/profile" element={<PrivateRoute user={user}><Profile /></PrivateRoute>} />
        <Route path="/user-blogs" element={<PrivateRoute user={user}><UserBlogs /></PrivateRoute>} />
        <Route path="/update-blog/:id" element={<PrivateRoute user={user}><UpdateBlog /></PrivateRoute>} />
        <Route path="/create-blog" element={<PrivateRoute user={user}><CreateBlog /></PrivateRoute>} />

        {/* New route for viewing an individual blog */}
        <Route path="/view-blog/:id" element={<ViewBlog />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
