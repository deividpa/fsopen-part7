import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showNotificationWithTimeout } from './redux/notificationSlice';
import { loginUser, logoutUser } from './redux/loginSlice';
import Togglable from './components/Togglable';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import UserList from './components/UsersList';
import UserView from './components/UserView';
import BlogView from './components/BlogView';

const App = () => {
  const userSession = useSelector((state) => state.login);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

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

  return (
    <Router>
      <div>
        <Notification type={notification.type} content={notification.content} />
        <nav
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            background: '#DDD',
          }}
        >
          <Link to="/">Blogs</Link>
          {userSession && <Link to="/users">Users</Link>}
          {!userSession ? (
            <Togglable buttonLabel="show login">
              <LoginForm onLogin={handleLogin} />
            </Togglable>
          ) : (
            <div>
              <span>{userSession.name} logged in</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<Home userSession={userSession} />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserView />} />
          <Route path="/blogs/:id" element={<BlogView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
