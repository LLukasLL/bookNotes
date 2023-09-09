import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
  setActivePage
}) => {

  const navigate = useNavigate()

  return (
    <Container>
      <Card style={{ width: '1 rem', padding: '24px' }}>
        <h2>Login</h2>
        <Form onSubmit={handleSubmit}>
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