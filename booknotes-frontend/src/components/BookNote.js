import { useEffect, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CloseButton from 'react-bootstrap/CloseButton'

import bookNotesService from '../services/bookNote'
import { icons } from '../services/icons'

import Symbol from './Symbol';


const BookNote = ({ bookNote, markings, refresh, setRefresh }) => {

  const [mod, setMod] = useState(null)
  const [keywords, setKeywords] = useState(bookNote.keywords)
  const [comments, setComments] = useState(bookNote.comments)
  const [highlight, setHighlight] = useState(bookNote.highlight)
  const [newKeyword, setNewKeyword] = useState('')
  const [newComment, setNewComment] = useState('')
  const [locationStart, setLocationStart] = useState(bookNote.locationStart)
  const [locationEnd, setLocationEnd] = useState(bookNote.locationEnd)
  const [markingID, setMarkingID] = useState(bookNote.marking)
  const [marking, setMarking] = useState({})

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMod(null)
    const updateObj = {}
    if (newKeyword !== '') {
      updateObj.keywords=keywords.concat(newKeyword)
      setKeywords(keywords.concat(newKeyword))
    } else {
      updateObj.keywords=keywords
    }
    if (newComment !== '') {
      updateObj.comments=comments.concat(newComment)
      setComments(comments.concat(newComment))
    } else {
      updateObj.comments=comments
    }
    if (highlight !== bookNote.highlight) updateObj.highlight = highlight
    if (locationStart !== bookNote.locationStart) updateObj.locationStart = locationStart
    if (locationEnd !== bookNote.locationEnd) updateObj.locationEnd = locationEnd
    await bookNotesService.update(bookNote.id, updateObj)
    setNewComment('')
    setNewKeyword('')
    if (locationStart !== bookNote.locationStart || locationEnd !== bookNote.locationEnd) {
      setRefresh(refresh + 1)
    }
 }

  const undo = () => {
    setHighlight(bookNote.highlight)
    setKeywords(bookNote.keywords)
    setComments(bookNote.comments)
    setNewComment('')
    setNewKeyword('') 
  }

  const exit = () => {
    undo()
    setMod(null)
  }

  const getIconPath = (thisIconName) => {
    const icon = icons.find((element => element.name === thisIconName))
    return icon.path
  }

  const getMarking = () => {
    for (let i = 0; i < markings.length; i++) {
      if (markingID === markings[i].id) {
        setMarking(markings[i])
        break
      }
    }
  }

  useEffect(() => {
    getMarking()
  }, [markingID])


  return ( mod === null 
        ? <Accordion.Item eventKey={bookNote.id} key={bookNote.id}>
        <Accordion.Header>
          {marking.iconName
            ? <Symbol
                path={getIconPath(marking.iconName)}
                color={marking.color}
              />
            : null}
          {highlight}
        </Accordion.Header>
        <Accordion.Body>
            <Row>
                <Col md="auto"><p>keywords: </p></Col>
                {keywords.map(keyword => <Col md="auto" key={keyword}><Badge bg="primary">{keyword}</Badge></Col>)}
            </Row>
            <p>comments:</p>
            {comments.map(comm => <p key={comm}>{comm}</p>)} 
          <Button onClick={() => setMod(true)} variant="outline-primary">edit</Button>
        </Accordion.Body>
        </Accordion.Item>
        : <Accordion.Item eventKey={bookNote.id} key={bookNote.id}>
        <Accordion.Header>
          {marking.iconName
            ? <Symbol
                path={getIconPath(marking.iconName)}
                color={marking.color}
              />
            : null}
          {highlight}
        </Accordion.Header>
        <Accordion.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-2'>
                <Form.Control
                  type='text'
                  value={highlight}
                  onChange={({ target }) => setHighlight(target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-2">
              <Row>
                <Col md='auto'>keywords:</Col>
                {keywords.map(keyword => <Col md="auto" key={keyword}>
                  <Badge bg="primary" onClick={() => setKeywords(keywords.filter(word => word !== keyword))}>
                    <span>{keyword}</span>
                    <CloseButton />
                  </Badge>
                </Col>)}
              </Row>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                type='text'
                placeholder='new Keyword'
                value={newKeyword}
                onChange={({ target }) => setNewKeyword(target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-2'>
            <Form.Label htmlFor="disabledSelect">comments:</Form.Label>
              {comments.map(comment => <p key={comment}>
                  <CloseButton onClick={() => setComments(comments.filter(comm => comm !== comment))}/>
                  {comment}
                </p>)}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                type='text'
                value={newComment}
                placeholder='new Comment'
                onChange={({ target }) => setNewComment(target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-2'>
              <Form.Label htmlFor="disabledSelect">Change Location of BookNote:</Form.Label>
              <Row>
                <Col xs lg='1'>
                  <Form.Label  style={{marginTop: '0.5rem'}} htmlFor="disabledSelect">Start:</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type='Number'
                    value={locationStart}
                    placeholder='location Start'
                    onChange={({ target }) => setLocationStart(target.value)}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs lg='1'>
                  <Form.Label  style={{marginTop: '0.5rem'}} htmlFor="disabledSelect">End:</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type='Number'
                    value={locationEnd}
                    placeholder='location End'
                    onChange={({ target }) => setLocationEnd(target.value)}
                  />
                </Col>
              </Row>
            </Form.Group>
            <Row>
              <Col md='auto'><Button type='submit'>save</Button></Col>
              <Col md='auto'><Button onClick={undo}>undo</Button></Col>
              <Col md='auto'><Button onClick={exit}>exit</Button></Col>
            </Row>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
  )
}

export default BookNote