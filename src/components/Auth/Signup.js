import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConfig'; // Adjust the import path as necessary
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Effect to set background when the component mounts
  useEffect(() => {
    document.body.style.backgroundImage = 'url(https://cdn.pixabay.com/photo/2019/09/17/18/48/computer-4484282_1280.jpg)';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';

    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
    };
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore without "verified" field
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        dob,
        createdAt: new Date().toISOString(),
      });

      console.log('User signed up successfully.');

      // Redirect to login page
      navigate('/login'); // Navigate to login page after signup
    } catch (err) {
      setError(err.message);
      console.error('Error signing up:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Sign Up</h2>
      <form onSubmit={handleSignup} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </label>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </label>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </label>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Date of Birth:
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              style={styles.input}
            />
          </label>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <p style={styles.redirectText}>
          Already have an account? <a href="/login" style={styles.link}>Log in</a>
        </p>
      </form>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: '400px',
    margin: '100px auto 0', // Increased top margin for more spacing from the top
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: 'rgba(249, 249, 249, 0.9)', // Slightly transparent for contrast
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    width: '100%', // Ensures the input takes full width
    boxSizing: 'border-box', // Ensures padding and border are included in the element's total width and height
  },
  button: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    textAlign: 'center',
  },
  redirectText: {
    textAlign: 'center',
    marginTop: '15px',
  },
  link: {
    color: '#4CAF50',
    textDecoration: 'underline',
  },
};

export default Signup;
