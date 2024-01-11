import { useState } from 'react'

import Accordion from 'react-bootstrap/Accordion'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/esm/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Symbol from './Symbol'

import { icons } from '../services/icons'
import markingsService from '../services/bookNote'


const Marking = ({ marking }) => {
  const [mod, setMod] = useState(null)
  const [name, setName] = useState(marking.name)
  const [color, setColor] = useState(marking.color)
  const [iconName, setIconName] = useState(marking.iconName)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('')
  const [newIconName, setNewIconName] = useState('')

  const undo = () => {
    setNewName(marking.name)
    setNewColor(marking.color)
    setNewIconName(marking.iconName)
  }

  const exit = () => {
    undo()
    setMod(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMod(null)
    const updatedMarking = {}
    if (newName !== '') updatedMarking.name = newName
    if (newColor !== '') updatedMarking.color = newColor
    if (newIconName !== '') updatedMarking.iconName = newIconName
    await markingsService.update(marking.id, updatedMarking)
    undo()
  }

  const getIconPath = (thisIconName) => {
    const icon = icons.find((element => element.name === thisIconName))
    return icon.path
  }
  
  return ( <Accordion.Item eventKey={marking.id} key={marking.id}>
      <Accordion.Header>
        <Symbol
          path={getIconPath(marking.iconName)}
          color={color}
        />
        {name}
      </Accordion.Header>
    {mod === null
      ? <Accordion.Body>
          <Row>
            <Col md='auto'><p>Color: </p></Col>
            <Col md='auto'>{color}</Col>
            <Col md='auto'></Col>
          </Row>
          <Row>
            <Col md='auto'><p>Icon name: </p></Col>
            <Col md='auto'>{iconName}</Col>
          </Row>
          <Row>
            <Col><Button onClick={() => setMod(true)} variant="outline-primary">edit</Button></Col>
          </Row>
        </Accordion.Body>
      : <Accordion.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Control
                type='text'
                value={newName}
                placeholder="new name"
                onChange={({ target }) => setNewName(target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                type='text'
                value={newColor}
                placeholder="new color"
                onChange={({ target }) => setNewColor(target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                type='text'
                value={newIconName}
                placeholder="new border color"
                onChange={({ target }) => setNewIconName(target.value)}
              />
            </Form.Group>
            <Row>
              <Col md='auto'><Button type='submit'>save</Button></Col>
              <Col md='auto'><Button onClick={undo}>undo</Button></Col>
              <Col md='auto'><Button onClick={exit}>exit</Button></Col>
          </Row>
          </Form>
      </Accordion.Body>}
    </Accordion.Item>
  )
}

export default Marking

