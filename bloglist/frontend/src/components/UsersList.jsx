import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUsers } from '../redux/usersSlice';
import styled from 'styled-components';

const UsersWrapper = styled.div`
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #333;
  text-align: center;
`;

const UsersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
`;

const TableHeader = styled.thead`
  background-color: #007bff;
  color: white;

  th {
    padding: 10px;
    text-align: left;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;

  a {
    color: #007bff;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const UsersList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (users.length === 0) {
    return <p>Loading users...</p>;
  }

  return (
    <UsersWrapper>
      <Title>Users</Title>
      <UsersTable>
        <TableHeader>
          <tr>
            <th>User</th>
            <th>Blogs created</th>
          </tr>
        </TableHeader>
        <tbody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </TableCell>
              <TableCell>{user.blogs.length}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </UsersTable>
    </UsersWrapper>
  );
};

export default UsersList;
