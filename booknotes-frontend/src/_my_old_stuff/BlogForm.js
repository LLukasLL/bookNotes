import { useState } from 'react'


const BlogForm = ({ addBlog }) => {

  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const createBlog = (event) => {
    event.preventDefault()
    const blogObj = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }
    addBlog(blogObj)
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  const handleBlogTitleChange = (e) => {
    setNewBlogTitle(e.target.value)
  }
  const handleBlogAuthorChange = (e) => {
    setNewBlogAuthor(e.target.value)
  }
  const handleBlogUrlChange = (e) => {
    setNewBlogUrl(e.target.value)
  }
  return (

    <form onSubmit={createBlog}>
      <input
        value={newBlogTitle}
        onChange={handleBlogTitleChange}
        placeholder='Blog Title'
      />
      <input
        value={newBlogAuthor}
        onChange={handleBlogAuthorChange}
        placeholder='Blog Author'
      />
      <input
        value={newBlogUrl}
        onChange={handleBlogUrlChange}
        placeholder='Blog Url'
      />
      <button type="submit">save</button>
    </form>
  )}

export default BlogForm