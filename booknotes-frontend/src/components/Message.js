import { useEffect } from "react"
import Spinner from 'react-bootstrap/Spinner'

const Message = ({ message, setMessage, loading }) => {

  return (
      <div style={{ display: "flex", justifyContent: "center" }} className="message">
          <p style={{ marginRight: "10px" }}>{message}</p>
          {loading
            && <Spinner animation="border" role="status">
              <span className="visually-hidden">{message}</span>
            </Spinner>}
      </div>
  )
}

export default Message