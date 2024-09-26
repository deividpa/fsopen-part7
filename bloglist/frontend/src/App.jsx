import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import blogService from './services/blogService';
import loginService from './services/loginService';
import { showNotificationWithTimeout } from './redux/notificationSlice';
import { setBlogs, addBlog, fetchBlogs, createBlog } from './redux/blogSlice';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Blog from './components/Blog';

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      dispatch(fetchBlogs()).then(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleLogin = async ({ username, password }) => {
    try {
      const loggedUser = await loginService.login({ username, password });
      window.localStorage.setItem(
        'loggedBlogAppUser',
        JSON.stringify(loggedUser)
      );
      blogService.setToken(loggedUser.token);
      setUser(loggedUser);
      dispatch(
        showNotificationWithTimeout('Login successful', 'success', 5000)
      );
    } catch (error) {
      dispatch(showNotificationWithTimeout('Wrong credentials', 'error', 5000));
    }
  };

  const handleLogout = () => {
    setUser(null);
    setBlogs([]);
    window.localStorage.removeItem('loggedBlogAppUser');
    dispatch(showNotificationWithTimeout('Logged out', 'info', 5000));
  };

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

    try {
      const updatedBlog = {
        ...blogToLike,
        likes: blogToLike.likes + 1,
        user: blogToLike.user,
      };
      const returnedBlog = await blogService.update(id, updatedBlog);

      setBlogs(
        (prevBlogs) =>
          prevBlogs
            .map((blog) => (blog.id !== id ? blog : returnedBlog))
            .sort((a, b) => b.likes - a.likes) // sort by likes in descending order
      );

      dispatch(
        showNotificationWithTimeout(
          `Blog "${returnedBlog.title}" liked successfully`,
          'success',
          5000
        )
      );
    } catch (error) {
      dispatch(showNotificationWithTimeout('Error liking blog', 'error', 5000));
    }
  };

  const handleDeleteBlog = async (id) => {
    const blogToDelete = blogs.find((blog) => blog.id === id);
    if (
      window.confirm(`Are you sure you want to delete "${blogToDelete.title}"?`)
    ) {
      try {
        await blogService.deleteBlog(id, user.token);

        setBlogs((prevBlogs) =>
          prevBlogs
            .filter((blog) => blog.id !== id)
            .sort((a, b) => b.likes - a.likes)
        );

        dispatch(
          showNotificationWithTimeout(
            `Blog "${blogToDelete.title}" deleted successfully`,
            'success',
            5000
          )
        );
      } catch (error) {
        dispatch(
          showNotificationWithTimeout('Error deleting blog', 'error', 5000)
        );
      }
    }
  };

  if (!user) {
    return (
      <div>
        <Notification type={notification.type} content={notification.content} />
        <Togglable buttonLabel="show login">
          <LoginForm onLogin={handleLogin} />
        </Togglable>
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>Logout</button>
      </p>
      <Notification type={notification.type} content={notification.content} />

      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>

      <h3>Blog List</h3>
      {isLoading ? (
        <p>Loading blogs...</p>
      ) : blogs && blogs.length > 0 ? (
        blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            onLikeBlog={handleLikeBlog}
            onDeleteBlog={handleDeleteBlog}
            currentUsername={user.username}
          />
        ))
      ) : (
        <p>No blogs available</p>
      )}
    </div>
  );
};

export default App;
