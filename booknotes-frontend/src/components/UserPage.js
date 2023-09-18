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
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';

const UserPage = ({ user, setErrorMessage, setMessage, setLoading }) => {
  const [file, setFile] = useState(null)
  const [clippingsString, setClippingsString] = useState(null)
  const [modifyAccount, setModifyAccount] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(false)

  
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

  const handleAccountChange = async e => {
    e.preventDefault()
    if (!passwordsMatch || newPassword.length < 5) {
      setErrorMessage('passwords do not match or are too short (must be minimum 5 characters long)')
      undo()
    } else {
      try {
        const passwords = {
          password: oldPassword,
          newPassword: newPassword
        }
        await userService.changePassword(user.id, passwords)
        setMessage('password changed succesfully')
        setTimeout(() => setMessage(null), 5000)
        setModifyAccount(false)
      } catch (exception) {
        setErrorMessage('password change failed')
        undo()
        setModifyAccount(false)
      }
    }
  }

  const undo = () => {
    setOldPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
  }

  useEffect(() => {
    // client-Side Validation for Password
    newPassword === confirmNewPassword
      ? setPasswordsMatch(true)
      : setPasswordsMatch(false)
  }, [newPassword, confirmNewPassword])

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
        <ListGroup.Item>
          {!modifyAccount
            ? <Button onClick={() => setModifyAccount(true)}>change Password</Button>
            : <Form onSubmit={handleAccountChange}>
                <p>Change Password:</p>
                <Form.Group className='mb-2'>
                  <Form.Control
                    isValid={oldPassword.length > 4}
                    type='password'
                    placeholder='old Password'
                    value={oldPassword}
                    onChange={({ target }) => setOldPassword(target.value)}
                  />
                </Form.Group>  
                <Form.Group className='mb-2'>
                  <Form.Control
                    isValid={passwordsMatch && newPassword.length > 4}
                    type='password'
                    placeholder='new Password'
                    value={newPassword}
                    onChange={({ target }) => setNewPassword(target.value)}
                  />
                </Form.Group>
                <Form.Group className='mb-2'>
                  <Form.Control
                    isValid={passwordsMatch  && confirmNewPassword.length > 4}
                    type='password'
                    placeholder='confirm new Password'
                    value={confirmNewPassword}
                    onChange={({ target }) => setConfirmNewPassword(target.value)}
                  />
                </Form.Group>
                <Row>
                  <Col md='auto'><Button type='submit'>save</Button></Col>
                  <Col md='auto'><Button onClick={undo}>clear</Button></Col>
                  <Col md='auto'><Button onClick={() => setModifyAccount(false)}>exit</Button></Col>
                </Row>
              </Form>
          }
        </ListGroup.Item>
      </ListGroup>
    </Container>
  )
}

export default UserPage