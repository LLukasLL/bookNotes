import ListGroup from 'react-bootstrap/ListGroup'
import Container from "react-bootstrap/esm/Container"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import userService from '../services/user'
import clippingsService from '../services/clippings'

const UserPage = ({ user, setErrorMessage, setMessage, setLoading }) => {
  const [file, setFile] = useState(null)
  const [clippingsString, setClippingsString] = useState(null)
  
  const handleFileSubmit = async e => {
    e.preventDefault()
    if (file) {
      // { clippingsString: 'the File Content' }
      let reader = new FileReader()
      reader.onload = async e => {
        setMessage('Upload and Database Update in progress')
        setLoading(true)
        setClippingsString(e.target.result)        
        const uploadObj = { clippingsString: e.target.result }
        await clippingsService.upload(uploadObj)
        setMessage('Upload finished')
        setLoading(null)
        setTimeout(() => {setMessage(null)}, 10000)
      }
      reader.readAsText(file)
    }
  }

  return (
    <Container>
      <ListGroup variant="flush">
        <ListGroup.Item>username: {user.username}</ListGroup.Item>
        <ListGroup.Item>name: {user.name}</ListGroup.Item>
        <ListGroup.Item>
          <Form onSubmit={handleFileSubmit}>
            <Row>
              <Col md='auto'>
                <Form.Label style={{marginTop: '0.5rem'}}>upload clippings.txt: </Form.Label>
              </Col>
              <Col md='auto'>
                <Form.Control 
                  type="file"
                  name='file'
                  onChange={({ target }) => setFile(target.files[0])}
                />
              </Col>
              <Col md='auto'>
                <Button variant="outline-success" type='submit'>Upload</Button>
              </Col>
            </Row>
          </Form>
        </ListGroup.Item>
      </ListGroup>
    </Container>
  )
}

export default UserPage