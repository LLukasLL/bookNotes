import ListGroup from 'react-bootstrap/ListGroup'
import Container from "react-bootstrap/esm/Container"

import userService from '../services/user'

const UserPage = ({ user }) => {
  return (
    <Container>
      <ListGroup variant="flush">
        <ListGroup.Item>username: {user.username}</ListGroup.Item>
        <ListGroup.Item>name: {user.name}</ListGroup.Item>
      </ListGroup>
    </Container>
  )
}

export default UserPage