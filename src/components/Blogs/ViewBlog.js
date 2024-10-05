// src/components/Blogs/ViewBlog.js
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Adjust import path as needed
import { useParams } from 'react-router-dom'; // Import useParams
import { ToastContainer, toast } from 'react-toastify'; // Import toast components
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import './ViewBlog.css'; // Optional: Import CSS for styling

const ViewBlog = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, 'blogs', id); // Reference the specific blog document
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() }); // Set blog data
        } else {
          toast.error('No such document!'); // Show error toast
        }
      } catch (error) {
        console.error('Error fetching blog: ', error);
        toast.error('Error fetching blog. Please try again.'); // Show error toast
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (!blog) {
    return <div>No blog found</div>; // Handle case where blog is not found
  }

  return (
    <div className="view-blog-container">
      <h1 className="view-blog-title">{blog.title}</h1>
      <img src={blog.imageUrl} alt={blog.title} className="view-blog-image" />
      <p className="view-blog-content">{blog.content}</p>
      <p className="view-blog-author"><strong>Author:</strong> {blog.author}</p>
      <p className="view-blog-timestamp"><strong>Posted on:</strong> {new Date(blog.createdAt).toLocaleString()}</p>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable /> {/* Toast container */}
    </div>
  );
};

export default ViewBlog;
