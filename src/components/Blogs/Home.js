// src/components/Blogs/Home.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Adjust import path as needed
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { PuffLoader } from 'react-spinners'; // Import PuffLoader
import './Home.css'; // Import CSS for styling

const Home = () => {
  const [bblogList, setBblogList] = useState([]);
  const [bisLoading, setBisLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));
        const bblogsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort the blogs by createdAt in descending order
        bblogsData.sort((a, b) => b.createdAt - a.createdAt);
        
        setBblogList(bblogsData);
      } catch (error) {
        console.error('Error fetching blogs: ', error);
      } finally {
        setBisLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleViewBlog = (id) => {
    navigate(`/view-blog/${id}`); // Navigate to the blog view page
  };

  // Function to limit content to 10 words
  const getExcerpt = (content) => {
    return content.split(' ').slice(0, 10).join(' ') + '...';
  };

  if (bisLoading) {
    return (
      <div className="bloading-spinner">
        <PuffLoader size={60} color="#36D7B7" /> {/* Spinner component with size and color */}
      </div>
    );
  }

  return (
    <div className="bhome-container">
      <h1>All Blogs</h1>
      {bblogList.length > 0 ? (
        bblogList.map(bblog => (
          <div className="bblog-card" key={bblog.id}>
            <img src={bblog.imageUrl} alt={bblog.title} className="bblog-image" />
            <div className="bblog-details">
              <h2 className="bblog-title">{bblog.title}</h2>
              <p className="bblog-excerpt">{getExcerpt(bblog.content)}</p> {/* Show first 10 words */}
              <p className="bblog-author"><strong>Author:</strong> {bblog.author}</p>
              <p className="bblog-timestamp"><strong>Posted on:</strong> {new Date(bblog.createdAt).toLocaleString()}</p>
              <button onClick={() => handleViewBlog(bblog.id)} className="bview-blog-button">View Blog</button> {/* New button */}
            </div>
          </div>
        ))
      ) : (
        <p className="bno-blogs-message">No blogs found</p>
      )}
    </div>
  );
};

export default Home;
