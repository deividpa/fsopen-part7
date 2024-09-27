import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogService';

const BlogView = () => {
  const [blog, setBlog] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const fetchedBlog = await blogService.getById(id);
        setBlog(fetchedBlog);
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>
        <strong>Author:</strong> {blog.author}
      </p>
      <p>
        <strong>URL:</strong> {blog.url}
      </p>
      <p>
        <strong>Likes:</strong> {blog.likes}
      </p>
    </div>
  );
};

export default BlogView;
