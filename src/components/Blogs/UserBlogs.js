import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebaseConfig'; // Import Firestore and Firebase Auth
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Firestore methods
import './UserBlogs.css'; // Import the CSS file
import ConfirmationModal from './ConfirmationModal';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import PuffLoader from 'react-spinners/PuffLoader'; // Import PuffLoader

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching blogs
  const [blogToDelete, setBlogToDelete] = useState(null); // Blog to be deleted
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const navigate = useNavigate();

  // Fetch user blogs when the component mounts
  useEffect(() => {
    const fetchUserBlogs = async () => {
      const user = auth.currentUser;
      if (user) {
        const userBlogsRef = collection(db, 'blogs');
        const q = query(userBlogsRef, where('author', '==', user.email)); // Query to get blogs by user
        const querySnapshot = await getDocs(q);
        
        const fetchedBlogs = [];
        querySnapshot.forEach((doc) => {
          fetchedBlogs.push({ id: doc.id, ...doc.data() }); // Push each blog document to the array
        });
        setBlogs(fetchedBlogs); // Set the fetched blogs to state
      }

      setLoading(false); // Set loading to false after fetching
    };

    fetchUserBlogs();
  }, []);

  const handleUpdateClick = (id) => {
    navigate(`/update-blog/${id}`); // Navigate to the update form for the selected blog
  };

  const handleDeleteClick = (id) => {
    setBlogToDelete(id); // Set the blog to be deleted
    setIsModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    if (blogToDelete) {
      try {
        await deleteDoc(doc(db, 'blogs', blogToDelete)); // Delete the blog from Firestore
        setBlogs(blogs.filter((blog) => blog.id !== blogToDelete)); // Remove the deleted blog from the UI
        setBlogToDelete(null); // Clear the selected blog
        setIsModalOpen(false); // Close the modal
        toast.success('Blog deleted successfully!'); // Show success toast
      } catch (error) {
        console.error('Error deleting blog: ', error);
        toast.error('Failed to delete blog.'); // Show error toast
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBlogToDelete(null); // Clear the selected blog
  };

  return (
    <div className="user-blogs-container">
      <h1 className="user-blogs-title">Your Blogs</h1>

      {/* PuffLoader while fetching data */}
      {loading ? (
        <div className="loader-container">
          <PuffLoader color="#36D7B7" size={60} /> {/* Customize color and size */}
        </div>
      ) : (
        <>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div className="blog-card" key={blog.id}>
                <div className="blog-title-container">
                  <h2 className="blog-title">{blog.title}</h2>
                  <div className="blog-actions">
                    <button className="update-button" onClick={() => handleUpdateClick(blog.id)}>
                      Update
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteClick(blog.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-blogs-message">No blogs found.</p>
          )}
        </>
      )}

      {/* Render ConfirmationModal */}
      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onConfirm={confirmDelete} 
      />

      <ToastContainer /> {/* Include ToastContainer for notifications */}
    </div>
  );
};

export default UserBlogs;
