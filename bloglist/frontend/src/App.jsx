import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import blogService from './services/blogService';
import { showNotificationWithTimeout } from './redux/notificationSlice';
import {
  fetchBlogs,
  createBlog,
  updateBlogLikes,
  removeBlog,
} from './redux/blogSlice';
import { setUserLogin, loginUser, logoutUser } from './redux/loginSlice';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Blog from './components/Blog';
import BlogView from './components/BlogView';
import UserList from './components/UsersList';
import UserView from './components/UserView';

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const userSession = useSelector((state) => state.login);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const blogFormRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
      if (loggedUserJSON) {
        const loggedUser = JSON.parse(loggedUserJSON);
        dispatch(setUserLogin(loggedUser));
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

  const handleLogin = async ({ username, password }) => {
    const result = await dispatch(loginUser({ username, password }));

    if (result.success) {
      dispatch(
        showNotificationWithTimeout('Login successful', 'success', 5000)
      );
    } else {
      dispatch(showNotificationWithTimeout(result.message, 'error', 5000));
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
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

  // const handleLikeBlog = async (id) => {
  //   const blogToLike = blogs.find((blog) => blog.id === id);

  //   try {
  //     const updatedBlog = {
  //       ...blogToLike,
  //       likes: blogToLike.likes + 1,
  //       user: blogToLike.user,
  //     };
  //     const returnedBlog = await blogService.update(id, updatedBlog);

  //     setBlogs(
  //       (prevBlogs) =>
  //         prevBlogs
  //           .map((blog) => (blog.id !== id ? blog : returnedBlog))
  //           .sort((a, b) => b.likes - a.likes) // sort by likes in descending order
  //     );

  //     dispatch(
  //       showNotificationWithTimeout(
  //         `Blog "${returnedBlog.title}" liked successfully`,
  //         'success',
  //         5000
  //       )
  //     );
  //   } catch (error) {
  //     dispatch(showNotificationWithTimeout('Error liking blog', 'error', 5000));
  //   }
  // };

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

  // const handleDeleteBlog = async (id) => {
  //   const blogToDelete = blogs.find((blog) => blog.id === id);
  //   if (
  //     window.confirm(`Are you sure you want to delete "${blogToDelete.title}"?`)
  //   ) {
  //     try {
  //       await blogService.deleteBlog(id, user.token);

  //       setBlogs((prevBlogs) =>
  //         prevBlogs
  //           .filter((blog) => blog.id !== id)
  //           .sort((a, b) => b.likes - a.likes)
  //       );

  //       dispatch(
  //         showNotificationWithTimeout(
  //           `Blog "${blogToDelete.title}" deleted successfully`,
  //           'success',
  //           5000
  //         )
  //       );
  //     } catch (error) {
  //       dispatch(
  //         showNotificationWithTimeout('Error deleting blog', 'error', 5000)
  //       );
  //     }
  //   }
  // };

  return (
    <Router>
      <div>
        <Notification type={notification.type} content={notification.content} />
        <nav>
          <Link to="/">Blogs</Link>
          {userSession && <Link to="/users">Users</Link>}
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h2>Blogs</h2>
                {!userSession ? (
                  <Togglable buttonLabel="show login">
                    <LoginForm onLogin={handleLogin} />
                  </Togglable>
                ) : (
                  <div>
                    <p>
                      {userSession.name} logged in{' '}
                      <button onClick={handleLogout}>Logout</button>
                    </p>

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
                )}
              </>
            }
          />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserView />} />
          <Route path="/blogs/:id" element={<BlogView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
