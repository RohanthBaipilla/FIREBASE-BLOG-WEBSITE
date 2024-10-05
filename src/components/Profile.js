import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig'; // Import Firebase auth and Firestore instances
import { doc, getDoc } from 'firebase/firestore'; // Firestore methods
import { onAuthStateChanged } from 'firebase/auth';
import { PuffLoader } from 'react-spinners';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserDetails(currentUser.uid); // Fetch user details from Firestore
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserDetails = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid); // Reference to Firestore document by user ID
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserDetails(userDoc.data());
      } else {
        setError('User data not found.');
      }
    } catch (err) {
      setError('Error fetching user details.');
      console.error('Error fetching user details: ', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner" style={styles.loaderContainer}>
        <PuffLoader size={60} color="#36D7B7" /> {/* Spinner component with size and color */}
      </div>
    );
  }
  

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Profile</h2>
      {user ? (
        <div style={styles.profile}>
          <div style={styles.imageContainer}>
            <img
              src={user.photoURL || "data:image/jpeg;base64,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"} // Placeholder if no image
              alt="Profile"
              style={styles.image}
            />
          </div>
          <div style={styles.detailsContainer}>
            <p style={styles.detail}><strong>Username:</strong> {userDetails.username}</p>
            <p style={styles.detail}><strong>Email:</strong> {userDetails.email}</p>
            <p style={styles.detail}><strong>Date of Birth:</strong> {userDetails.dob}</p>
            <p style={styles.detail}><strong>Account Created At:</strong> {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

// Basic styles
const styles = {
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // This ensures the spinner is vertically centered
  },

  container: {
    maxWidth: '400px',
    margin: '40px auto 0', // Add top margin (40px) and auto side margins, no bottom margin
    padding: '20px', // Adjust padding as needed
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  profile: {
    display: 'flex',
    flexDirection: 'column', // Stack elements vertically
    alignItems: 'center', // Center elements horizontally
    padding: '20px', // Add padding for spacing inside the profile
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    width: '100px',
    height: '100px',
    borderRadius: '50%', // Round image
    overflow: 'hidden', // Ensure the image fits inside the circle
    marginBottom: '15px', // Space below the image
    border: '2px solid #ccc', // Optional border
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Cover the entire container
  },
  detailsContainer: {
    textAlign: 'left', // Align text to the left
    width: '100%', // Make full width to utilize padding
  },
  detail: {
    paddingLeft: '10px', // Add left padding for alignment
    margin: '5px 0', // Margin for spacing between lines
  },
};

export default Profile;
