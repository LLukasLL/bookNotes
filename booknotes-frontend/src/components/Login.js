import { useState } from 'react'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';

import loginService from '../services/login'
import auth from '../services/auth'

const LoginForm = ({
  user,
  setUser,
  setErrorMessage
}) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 
  const navigate = useNavigate()

  const handleUsernameChange =({ target }) => setUsername(target.value)
  const handlePasswordChange= ({ target }) => setPassword(target.value)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem( 'loggedInAppUser', JSON.stringify(user) )
      auth.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 500)
    }
  }
  return (
    <Container>
      <Card style={{ width: '1 rem', padding: '24px' }}>
        <h2>Login</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Control 
              type="username" 
              placeholder="username"
              value={username}
              onChange={handleUsernameChange}
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
          <Row>
            <Col md='auto'><Button variant="primary" type="submit">Submit</Button></Col>
            <Col md='auto'><Button variant="primary" onClick={() => navigate('/register')}>Register</Button></Col>
          </Row>
        </Form>
      </Card>
    </Container>
  )
}

export default LoginForm