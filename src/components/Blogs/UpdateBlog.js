// src/components/Blogs/UpdateBlog.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../../firebaseConfig'; // Firebase authentication instance
import { storage, db } from '../../firebaseConfig'; // Firebase storage and Firestore instances
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify
import './UpdateBlog.css'; // Import the updated CSS

const UpdateBlog = () => {
  const { id } = useParams(); // Get blog ID from URL params
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  // Fetch existing blog data to pre-fill the form
  useEffect(() => {
    const fetchBlog = async () => {
      const blogRef = doc(db, 'blogs', id); // Adjust collection name as needed
      const blogSnap = await getDoc(blogRef);

      if (blogSnap.exists()) {
        const blogData = blogSnap.data();
        setTitle(blogData.title);
        setContent(blogData.content);
        setImageUrl(blogData.imageUrl); // Existing image URL
      } else {
        console.error('No such document!');
      }
    };

    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle image upload if a new image is selected
    let uploadedImageUrl = imageUrl; // Default to existing image URL

    if (image) {
      const imageRef = ref(storage, `blogs/${id}/${image.name}`);
      await uploadBytes(imageRef, image);
      uploadedImageUrl = await getDownloadURL(imageRef);
    }

    // Update the blog in Firestore
    const blogRef = doc(db, 'blogs', id); // Adjust collection name as needed
    await updateDoc(blogRef, {
      title,
      content,
      imageUrl: uploadedImageUrl,
    });

    // Display success toast message
    toast.success('Blog updated successfully!');

    // Navigate to user's blogs after a short delay
    setTimeout(() => {
      navigate('/user-blogs'); // Navigate to user's blogs after update
    }, 2000); // 2 seconds delay
  };

  return (
    <div className="aaa-update-blog-container">
      <h1>Update Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="bbb-form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="bbb-form-group">
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="bbb-form-group">
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        {imageUrl && (
          <div>
            <p>Current Image:</p>
            <img src={imageUrl} alt="Current Blog" style={{ width: '200px' }} />
          </div>
        )}
        <button type="submit">Update Blog</button>
      </form>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
    </div>
  );
};

export default UpdateBlog;
