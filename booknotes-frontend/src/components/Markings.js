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