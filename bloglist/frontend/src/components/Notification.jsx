import React from 'react';
import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (notification.type === '' || notification.content === '') {
    return null;
  }

  return (
    <div className={notification.type} style={{ margin: '0.4rem 0' }}>
      {notification.content}
    </div>
  );
};

export default Notification;
