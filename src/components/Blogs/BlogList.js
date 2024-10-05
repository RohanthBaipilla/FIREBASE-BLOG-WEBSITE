import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Import Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Firestore methods
import './BlogList.css'; // Optional: CSS for styling

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsCollection = collection(db, 'blogs');
        const blogSnapshot = await getDocs(blogsCollection);
        const blogList = blogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlogs(blogList);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div>Loading blogs...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="blog-list-container">
      <h2>All Blogs</h2>
      {blogs.map(blog => (
        <div className="blog-card" key={blog.id}>
          <img src={blog.imageUrl} alt={blog.title} className="blog-image" />
          <div className="blog-content">
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
            <p><strong>Author:</strong> {blog.author}</p>
            <p><strong>Posted on:</strong> {new Date(blog.createdAt).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
