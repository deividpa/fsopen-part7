import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import userService from '../services/userService';
import styled from 'styled-components';

const UserWrapper = styled.div`
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 2rem auto;
`;

const UserName = styled.h2`
  font-size: 2rem;
  color: #343a40;
  margin-bottom: 1rem;
`;

const BlogsTitle = styled.h3`
  font-size: 1.5rem;
  color: #495057;
  margin-bottom: 0.5rem;
`;

const BlogList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const BlogItem = styled.li`
  margin-bottom: 0.5rem;

  a {
    color: #007bff;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoadingMessage = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  text-align: center;
`;

const UserView = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await userService.getUserById(id);
        setUser(fetchedUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return <LoadingMessage>Loading user data...</LoadingMessage>;
  }

  return (
    <UserWrapper>
      <UserName>{user.name}</UserName>
      <BlogsTitle>Added blogs:</BlogsTitle>
      <BlogList>
        {user.blogs.map((blog) => (
          <BlogItem key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </BlogItem>
        ))}
      </BlogList>
    </UserWrapper>
  );
};

export default UserView;
