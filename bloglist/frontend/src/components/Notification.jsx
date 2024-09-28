import React from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

const NotificationWrapper = styled.div`
  padding: 10px;
  margin: 0.4rem 0;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  ${(props) =>
    props.type === 'success' &&
    css`
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    `}
  ${(props) =>
    props.type === 'error' &&
    css`
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    `}
  ${(props) =>
    props.type === 'info' &&
    css`
      background-color: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    `}
  ${(props) =>
    props.type === 'warning' &&
    css`
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    `}
`;

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (notification.type === '' || notification.content === '') {
    return null;
  }

  return (
    <NotificationWrapper type={notification.type}>
      {notification.content}
    </NotificationWrapper>
  );
};

export default Notification;
