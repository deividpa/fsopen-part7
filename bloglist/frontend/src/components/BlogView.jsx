import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogService';
import styled from 'styled-components';

const BlogContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
`;

const Author = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const Likes = styled.p`
  font-size: 1rem;
  color: #888;
  margin-bottom: 20px;
`;

const CommentsContainer = styled.div`
  margin-top: 30px;
`;

const CommentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CommentItem = styled.li`
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const BlogView = () => {
  const [blog, setBlog] = useState(null);
  const [newComment, setNewComment] = useState('');
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

  const handleAddComment = async () => {
    try {
      const updatedBlog = await blogService.addComment(id, newComment);
      setBlog(updatedBlog);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <BlogContainer>
      <Title>{blog.title}</Title>
      <Author>
        <strong>Author:</strong> {blog.author}
      </Author>
      <p>
        <strong>URL:</strong> {blog.url}
      </p>
      <Likes>
        <strong>Likes:</strong> {blog.likes}
      </Likes>

      <CommentsContainer>
        <h3>Comments</h3>
        {blog.comments.length > 0 ? (
          <CommentList>
            {blog.comments.map((comment, index) => (
              <CommentItem key={index}>{comment}</CommentItem>
            ))}
          </CommentList>
        ) : (
          <p>No comments yet.</p>
        )}

        <Input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <Button onClick={handleAddComment}>Add Comment</Button>
      </CommentsContainer>
    </BlogContainer>
  );
};

export default BlogView;
