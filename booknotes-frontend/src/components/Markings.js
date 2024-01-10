import Marking from "./Marking"
import Accordion from 'react-bootstrap/Accordion'
import Container from "react-bootstrap/esm/Container"
import { useEffect, useState } from "react"
import { Navigate } from 'react-router-dom'

import markingService from '../services/markings'

const Markings = ({ user, setErrorMessage, refresh, setRefresh }) => {
  const [markings, setMarkings] = useState([])

  useEffect(() => {
    async function getMarkings() {
      try {
        const markings = await markingService.getAll()
        setMarkings(markings)
      } catch (exception) {
        console.log('error catched')
        setErrorMessage('request failed')
      }
    }
    if (user !== null && user !== 'not checked') getMarkings()
  }, [user])

  const icons = [
    { 
      name: 'search',
      svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
    },{
      name: 'share',
      svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
          <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
        </svg>
    }
  ]

  return (
      <Container>
        <Accordion defaultActiveKey="0" flush>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              Your Markings:
            </Accordion.Header>
          </Accordion.Item>
          {markings
            .map(marking => <Marking
              key={marking.id}
              marking={marking}
              refresh={refresh}
              setRefresh={setRefresh}
              />)}
        </Accordion>
      </Container>
  )
}

export default Markings