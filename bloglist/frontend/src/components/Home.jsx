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
import styled from 'styled-components';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const BlogListTitle = styled.h3`
  font-size: 1.8rem;
  color: #555;
  margin-bottom: 10px;
`;

const BlogContainer = styled.div`
  margin-top: 30px;
`;

const LoadingMessage = styled.p`
  font-size: 1.2rem;
  color: #666;
  text-align: center;
`;

const NoBlogsMessage = styled.p`
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  margin-top: 20px;
`;

const LoginPrompt = styled.p`
  font-size: 1.4rem;
  color: #d9534f;
  text-align: center;
  margin-top: 20px;
`;

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
    <Container>
      <Title>Blogs</Title>
      {userSession ? (
        <div>
          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm createBlog={handleCreateBlog} />
          </Togglable>
          <BlogListTitle>Blog List</BlogListTitle>
          <BlogContainer>
            {isLoading ? (
              <LoadingMessage>Loading blogs...</LoadingMessage>
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
              <NoBlogsMessage>No blogs available</NoBlogsMessage>
            )}
          </BlogContainer>
        </div>
      ) : (
        <LoginPrompt>Please log in to see blogs.</LoginPrompt>
      )}
    </Container>
  );
};

export default Home;
