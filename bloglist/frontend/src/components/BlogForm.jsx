import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 5px;
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreateBlog = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <Form onSubmit={handleCreateBlog}>
      <FormGroup>
        <Label htmlFor="title">Title:</Label>
        <Input
          id="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder="Enter blog title"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="author">Author:</Label>
        <Input
          id="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          placeholder="Enter blog author"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="url">URL:</Label>
        <Input
          id="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          placeholder="Enter blog URL"
        />
      </FormGroup>
      <Button type="submit" id="createBlog">
        Create
      </Button>
    </Form>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
