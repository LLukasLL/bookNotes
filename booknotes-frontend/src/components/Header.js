import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useEffect, useState } from 'react';

import clippingsService from '../services/clippings'

const Header = ({ user, logout, setActiveBook }) => {
  const [file, setFile] = useState(null)
  const [clippingsString, setClippingsString] = useState(null)
  
  const handleFileChange = ({ target }) => setFile(target.files[0])

  const handleFileSubmit = async e => {
    e.preventDefault()
    if (file) {
      // { clippingsString: 'the File Content' }
      let reader = new FileReader()
      reader.onload = async e => {
        setClippingsString(e.target.result)        
        const uploadObj = { clippingsString: e.target.result }
        await clippingsService.upload(uploadObj)
      }
      reader.readAsText(file)
    }
  }

  const fileUpload = () => {
    return (
          <Form onSubmit={handleFileSubmit}>
            <Row>
                <Col md='auto'>
                  <Form.Label style={{marginTop: '0.5rem'}}>upload clippings.txt: </Form.Label>
                </Col>
                <Col md='auto'>
                  <Form.Control 
                    type="file"
                    name='file'
                    onChange={handleFileChange}
                  />
                </Col>
              <Col md='auto'>
                <Button variant="outline-success" type='submit'>Upload</Button>
              </Col>
            </Row>
          </Form>
    )
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>bookNotes</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => setActiveBook(null)}>Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        {user && fileUpload()}
        <Nav>
          {user && <Nav.Link onClick={logout}>Logout</Nav.Link>}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;