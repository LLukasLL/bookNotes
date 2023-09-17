import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { useNavigate } from 'react-router-dom';

const Header = ({ user, logout, setMessage }) => {

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>bookNotes</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate('/books')}>Books</Nav.Link>
            <Nav.Link onClick={() => navigate('/user')}>User</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav>
            { user && <Nav.Item style={{ paddingRight: '1vw'}}>logged in as '{user.username}'</Nav.Item>}
        </Nav>
        <Nav>
          {user && <Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;