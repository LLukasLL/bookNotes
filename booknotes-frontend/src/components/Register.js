import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';

import userService from '../services/user'

const RegisterForm = ({
  setErrorMessage
}) => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('') 
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()

  const handleUsernameChange=({ target }) => setUsername(target.value)
  const handleNameChange=({ target }) => setName(target.value)
  const handlePasswordChange=({ target }) => setPassword(target.value)
  const handleConfirmPasswordChange=({ target }) => setConfirmPassword(target.value)
  
  const handleRegister = async e => {
    e.preventDefault()
    try {
      const newUser = {
        username: username,
        name: name,
        password: password
      }
      await userService.create(newUser)
      navigate('/login')
    } catch (exception) {
      setErrorMessage(exception)
      setTimeout(() => setErrorMessage(null), 500)
    }
  }

  return (
    <Container>
      <Card style={{ width: '1 rem', padding: '24px' }}>
        <h2>Register</h2>
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Control 
              type="username" 
              placeholder="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control 
              type="text" 
              placeholder="name"
              value={name}
              onChange={handleNameChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type='password'
              placeholder='password'
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type='password'
              placeholder='confirm password'
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </Form.Group>
          <Row>
            <Col md='auto'><Button variant="primary" type="submit">Submit</Button></Col>
            <Col md='auto'><Button onClick={() => navigate('/login')}>Cancel</Button></Col>
          </Row>
        </Form>
      </Card>
    </Container>
  )
}

export default RegisterForm 