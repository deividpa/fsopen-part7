import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import blogService from '../services/blogService';
import {
  fetchBlogs,
  createBlog,
  updateBlogLikes,
  removeBlog,
} from '../redux/blogSlice';
import { showNotificationWithTimeout } from '../redux/notificationSlice';
import Togglable from './Togglable';
import BlogForm from './BlogForm';
import Blog from './Blog';

const Home = ({ userSession }) => {
  const blogs = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const blogFormRef = useRef();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
      if (loggedUserJSON) {
        const loggedUser = JSON.parse(loggedUserJSON);
        blogService.setToken(loggedUser.token);
        try {
          await dispatch(fetchBlogs());
        } catch (error) {
          console.error('Error fetching blogs:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleCreateBlog = async (newBlog) => {
    try {
      const createdBlog = await dispatch(createBlog(newBlog));
      blogFormRef.current.toggleVisibility();
      dispatch(
        showNotificationWithTimeout(
          `Blog "${createdBlog.title}" by ${createdBlog.author} added successfully`,
          'success',
          5000
        )
      );
    } catch (error) {
      dispatch(
        showNotificationWithTimeout(
          `Error creating blog ${error}`,
          'error',
          5000
        )
      );
    }
  };

  const handleLikeBlog = async (id) => {
    const blogToLike = blogs.find((blog) => blog.id === id);
    const updatedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
      user: blogToLike.user,
    };

    try {
      await dispatch(updateBlogLikes(id, updatedBlog));
      dispatch(
        showNotificationWithTimeout(
          `Blog "${blogToLike.title}" liked successfully`,
          'success',
          5000
        )
      );
    } catch (error) {
      dispatch(
        showNotificationWithTimeout(`Error liking blog ${error}`, 'error', 5000)
      );
    }
  };

  const handleDeleteBlog = async (id) => {
    const blogToDelete = blogs.find((blog) => blog.id === id);
    if (
      window.confirm(`Are you sure you want to delete "${blogToDelete.title}"?`)
    ) {
      try {
        await dispatch(removeBlog(id));
        dispatch(
          showNotificationWithTimeout(
            `Blog "${blogToDelete.title}" deleted successfully`,
            'success',
            5000
          )
        );
      } catch (error) {
        dispatch(
          showNotificationWithTimeout(
            `Error deleting blog ${error}`,
            'error',
            5000
          )
        );
      }
    }
  };

  return (
    <div>
      <h2>Blogs</h2>
      {userSession ? (
        <div>
          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm createBlog={handleCreateBlog} />
          </Togglable>

          <h3>Blog List</h3>
          {isLoading ? (
            <p>Loading blogs...</p>
          ) : blogs.length > 0 ? (
            blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                onLikeBlog={handleLikeBlog}
                onDeleteBlog={handleDeleteBlog}
                currentUsername={userSession.username}
              />
            ))
          ) : (
            <p>No blogs available</p>
          )}
        </div>
      ) : (
        <p>Please log in to see blogs.</p>
      )}
    </div>
  );
};

export default Home;
