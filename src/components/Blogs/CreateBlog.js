import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebaseConfig'; // Import Firestore and Storage instances
import { collection, addDoc } from 'firebase/firestore'; // Firestore methods
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Storage methods
import { auth } from '../../firebaseConfig'; // Firebase auth
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CreateBlog.css'; // Optional: CSS for styling

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch username from Firebase Auth
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName || user.email); // Use displayName or email as username
    }
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Get the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!title || !content || !image) {
      setError('Please fill in all fields and upload an image.');
      setLoading(false);
      return;
    }

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `blogImages/${image.name}`);
      await uploadBytes(imageRef, image); // Upload the image
      const imageUrl = await getDownloadURL(imageRef); // Get the download URL

      // Save blog post to Firestore
      const blogRef = collection(db, 'blogs');
      await addDoc(blogRef, {
        title,
        content,
        imageUrl,
        author: username,
        createdAt: new Date().toISOString(),
      });

      // Reset form fields
      setTitle('');
      setContent('');
      setImage(null);
      document.getElementById('image').value = ''; // Reset file input

      // Show toast notification
      toast.success('Blog created successfully!'); // Show toast notification

      // Redirect to user blogs after a short delay
      setTimeout(() => {
        navigate('/user-blogs'); // Navigate after 2 seconds
      }, 2000); // Change 2000 to your desired delay time in milliseconds

    } catch (err) {
      console.error('Error creating blog:', err);
      setError('Failed to create blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-container">
      <h2>Create Blog</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
      <ToastContainer /> {/* Add the ToastContainer component */}
    </div>
  );
};

export default CreateBlog;
